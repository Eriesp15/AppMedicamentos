package com.appmedicamentos

import android.app.AlarmManager
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class AlarmLaunchModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AlarmLaunchModule"

    @ReactMethod
    fun requestSpecialAlarmPermissions(promise: Promise) {
        val context = reactApplicationContext

        val openedSettings = tryOpenFullScreenIntentSettings(context) ||
            tryOpenExactAlarmSettings(context) ||
            tryOpenOverlaySettings(context) ||
            tryOpenBatteryOptimizationSettings(context)

        promise.resolve(openedSettings)
    }

    @ReactMethod
    fun scheduleAlarm(timestamp: Double, notificationId: String, data: ReadableMap) {
        val context = reactApplicationContext
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        val intent = Intent(context, AlarmReceiver::class.java).apply {
            putExtra("notificationId", notificationId)
            putExtra("medicationId", data.getString("medicationId"))
            putExtra("medicationName", data.getString("medicationName"))
            putExtra("scheduledTime", data.getString("scheduledTime"))
            putExtra("dosage", data.getString("dosage"))
            putExtra("snoozeMinutes", data.getInt("snoozeMinutes"))
            putExtra("alarmSound", data.getString("alarmSound"))
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            ("alarm_launch_" + notificationId).hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val activityIntent = Intent(context, AlarmActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                Intent.FLAG_ACTIVITY_CLEAR_TOP or
                Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra("notificationId", notificationId)
            putExtra("medicationId", data.getString("medicationId"))
            putExtra("medicationName", data.getString("medicationName"))
            putExtra("scheduledTime", data.getString("scheduledTime"))
            putExtra("dosage", data.getString("dosage"))
            putExtra("snoozeMinutes", data.getInt("snoozeMinutes"))
            putExtra("alarmSound", data.getString("alarmSound"))
            putExtra("fromNativeAlarm", true)
        }
        val showIntent = PendingIntent.getActivity(
            context,
            ("alarm_show_" + notificationId).hashCode(),
            activityIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            alarmManager.setAlarmClock(
                AlarmManager.AlarmClockInfo(timestamp.toLong(), showIntent),
                pendingIntent
            )
        } else {
            alarmManager.setExact(
                AlarmManager.RTC_WAKEUP,
                timestamp.toLong(),
                pendingIntent
            )
        }
    }

    @ReactMethod
    fun cancelAlarm(notificationId: String) {
        val context = reactApplicationContext
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        val intent = Intent(context, AlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            ("alarm_launch_" + notificationId).hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        alarmManager.cancel(pendingIntent)
        pendingIntent.cancel()
    }

    @ReactMethod
    fun clearAlarmNotification(notificationId: String) {
        val context = reactApplicationContext
        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.cancel(notificationId.hashCode())
    }

    private fun startSettingsActivity(context: Context, intent: Intent): Boolean {
        return try {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
            true
        } catch (_: Exception) {
            false
        }
    }

    private fun appSettingsUri(context: Context): Uri {
        return Uri.parse("package:${context.packageName}")
    }

    private fun tryOpenFullScreenIntentSettings(context: Context): Boolean {
        if (Build.VERSION.SDK_INT < 34) {
            return false
        }

        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (notificationManager.canUseFullScreenIntent()) {
            return false
        }

        return startSettingsActivity(
            context,
            Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT).apply {
                data = appSettingsUri(context)
            }
        )
    }

    private fun tryOpenExactAlarmSettings(context: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            return false
        }

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        if (alarmManager.canScheduleExactAlarms()) {
            return false
        }

        return startSettingsActivity(
            context,
            Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                data = appSettingsUri(context)
            }
        )
    }

    private fun tryOpenOverlaySettings(context: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(context)) {
            return false
        }

        return startSettingsActivity(
            context,
            Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION).apply {
                data = appSettingsUri(context)
            }
        )
    }

    private fun tryOpenBatteryOptimizationSettings(context: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return false
        }

        val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        if (powerManager.isIgnoringBatteryOptimizations(context.packageName)) {
            return false
        }

        val requestIntent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
            data = appSettingsUri(context)
        }
        return startSettingsActivity(context, requestIntent) ||
            startSettingsActivity(context, Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS))
    }
}
