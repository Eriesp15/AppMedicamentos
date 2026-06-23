package com.appmedicamentos

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val notificationId = intent.getStringExtra("notificationId") ?: "medicine-alarm-native"
        val activityIntent = createAlarmActivityIntent(context, intent)
        val pendingIntentFlags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        val fullScreenPendingIntent = PendingIntent.getActivity(
            context,
            ("alarm_activity_$notificationId").hashCode(),
            activityIntent,
            pendingIntentFlags
        )
        val channelId = createAlarmChannel(context, intent.getStringExtra("alarmSound"))

        val soundName = getSoundResourceName(intent.getStringExtra("alarmSound"))
        val soundUri = if (soundName == "default") {
            Settings.System.DEFAULT_ALARM_ALERT_URI
        } else {
            android.net.Uri.parse("android.resource://${context.packageName}/raw/$soundName")
        }

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("Alarma de medicamento")
            .setContentText("${intent.getStringExtra("medicationName") ?: "Medicamento"} - ${intent.getStringExtra("dosage") ?: ""}")
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(true)
            .setAutoCancel(false)
            .setSound(soundUri)
            .setVibrate(longArrayOf(0, 500, 200, 500, 200, 500))
            .setContentIntent(fullScreenPendingIntent)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .addAction(0, "Tomado", fullScreenPendingIntent)
            .addAction(0, "Posponer", fullScreenPendingIntent)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(notificationId.hashCode(), notification)
        } catch (_: SecurityException) {
            // Android 13+ can block notifications if the permission was denied.
        }

        wakeScreenBriefly(context)

        try {
            context.startActivity(activityIntent)
        } catch (_: Exception) {
            // The full-screen notification above is the supported background launch path.
        }
    }

    private fun createAlarmActivityIntent(context: Context, source: Intent): Intent {
        return Intent(context, AlarmActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP or
                    Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra("notificationId", source.getStringExtra("notificationId"))
            putExtra("medicationId", source.getStringExtra("medicationId"))
            putExtra("medicationName", source.getStringExtra("medicationName"))
            putExtra("scheduledTime", source.getStringExtra("scheduledTime"))
            putExtra("dosage", source.getStringExtra("dosage"))
            putExtra("snoozeMinutes", source.getIntExtra("snoozeMinutes", 10))
            putExtra("alarmSound", source.getStringExtra("alarmSound"))
            putExtra("fromNativeAlarm", true)
        }
    }

    private fun createAlarmChannel(context: Context, alarmSound: String?): String {
        val soundName = getSoundResourceName(alarmSound)
        val channelId = "medicine-alarm-native-$soundName"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val channelName = when (alarmSound) {
                "gentle" -> "Alarmas suaves"
                "classic" -> "Alarmas clasicas"
                "loud" -> "Alarmas fuertes"
                else -> "Alarmas normales"
            }
            val channel = NotificationChannel(
                channelId,
                channelName,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Alarmas de medicamentos"
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 200, 500, 200, 500)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
                val soundUri = if (soundName == "default") {
                    Settings.System.DEFAULT_ALARM_ALERT_URI
                } else {
                    android.net.Uri.parse("android.resource://${context.packageName}/raw/$soundName")
                }
                setSound(soundUri, android.media.AudioAttributes.Builder()
                    .setUsage(android.media.AudioAttributes.USAGE_ALARM)
                    .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build())
            }
            notificationManager.createNotificationChannel(channel)
        }

        return channelId
    }

    private fun getSoundResourceName(alarmSound: String?): String {
        return when (alarmSound) {
            "gentle" -> "med_alarm_gentle"
            "classic" -> "med_alarm_classic"
            "loud" -> "med_alarm_loud"
            else -> "default"
        }
    }

    private fun wakeScreenBriefly(context: Context) {
        val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        val wakeLock = powerManager.newWakeLock(
            PowerManager.FULL_WAKE_LOCK or
                    PowerManager.ACQUIRE_CAUSES_WAKEUP or
                    PowerManager.ON_AFTER_RELEASE,
            "AppMedicamentos:AlarmWakeLock"
        )
        wakeLock.acquire(10_000)
    }

}
