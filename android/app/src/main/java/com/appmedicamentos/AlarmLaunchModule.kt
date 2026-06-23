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

        val medicationId = if (data.hasKey("medicationId")) data.getString("medicationId") else ""
        val medicationName = if (data.hasKey("medicationName")) data.getString("medicationName") else "Medicamento"
        val scheduledTime = if (data.hasKey("scheduledTime")) data.getString("scheduledTime") else ""
        val dosage = if (data.hasKey("dosage")) data.getString("dosage") else ""
        val snoozeMinutes = if (data.hasKey("snoozeMinutes")) data.getInt("snoozeMinutes") else 10
        val alarmSound = if (data.hasKey("alarmSound")) data.getString("alarmSound") else "default"

        val intent = Intent(context, AlarmReceiver::class.java).apply {
            putExtra("notificationId", notificationId)
            putExtra("medicationId", medicationId)
            putExtra("medicationName", medicationName)
            putExtra("scheduledTime", scheduledTime)
            putExtra("dosage", dosage)
            putExtra("snoozeMinutes", snoozeMinutes)
            putExtra("alarmSound", alarmSound)
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
            putExtra("medicationId", medicationId)
            putExtra("medicationName", medicationName)
            putExtra("scheduledTime", scheduledTime)
            putExtra("dosage", dosage)
            putExtra("snoozeMinutes", snoozeMinutes)
            putExtra("alarmSound", alarmSound)
            putExtra("fromNativeAlarm", true)
        }
        val showIntent = PendingIntent.getActivity(
            context,
            ("alarm_show_" + notificationId).hashCode(),
            activityIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setAlarmClock(
                        AlarmManager.AlarmClockInfo(timestamp.toLong(), showIntent),
                        pendingIntent
                    )
                } else {
                    // Fallback to inexact set() if we cannot schedule exact alarms
                    alarmManager.set(
                        AlarmManager.RTC_WAKEUP,
                        timestamp.toLong(),
                        pendingIntent
                    )
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
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
        } catch (e: SecurityException) {
            // Safe fallback to inexact RTC_WAKEUP alarm
            try {
                alarmManager.set(
                    AlarmManager.RTC_WAKEUP,
                    timestamp.toLong(),
                    pendingIntent
                )
            } catch (_: Exception) {}
        } catch (e: Exception) {
            // General catch-all to prevent app crashes from background scheduling
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

    @ReactMethod
    fun checkOverlayPermission(promise: Promise) {
        val result = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Settings.canDrawOverlays(reactApplicationContext)
        } else {
            true
        }
        promise.resolve(result)
    }

    @ReactMethod
    fun openOverlaySettings() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            startSettingsActivity(
                reactApplicationContext,
                Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION).apply {
                    data = appSettingsUri(reactApplicationContext)
                }
            )
        }
    }

    @ReactMethod
    fun checkBatteryOptimization(promise: Promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            promise.resolve(true)
            return
        }
        val powerManager = reactApplicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager
        promise.resolve(powerManager.isIgnoringBatteryOptimizations(reactApplicationContext.packageName))
    }

    @ReactMethod
    fun openBatteryOptimizationSettings() {
        val context = reactApplicationContext
        val requestIntent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
            data = appSettingsUri(context)
        }
        startSettingsActivity(context, requestIntent)
    }

    @ReactMethod
    fun checkExactAlarmPermission(promise: Promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            promise.resolve(true)
            return
        }
        val alarmManager = reactApplicationContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        promise.resolve(alarmManager.canScheduleExactAlarms())
    }

    @ReactMethod
    fun openExactAlarmSettings() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            startSettingsActivity(
                reactApplicationContext,
                Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                    data = appSettingsUri(reactApplicationContext)
                }
            )
        }
    }

    @ReactMethod
    fun checkFullScreenIntentPermission(promise: Promise) {
        if (Build.VERSION.SDK_INT < 34) {
            promise.resolve(true)
            return
        }
        val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        promise.resolve(notificationManager.canUseFullScreenIntent())
    }

    @ReactMethod
    fun openFullScreenIntentSettings() {
        if (Build.VERSION.SDK_INT >= 34) {
            startSettingsActivity(
                reactApplicationContext,
                Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT).apply {
                    data = appSettingsUri(reactApplicationContext)
                }
            )
        }
    }

    @ReactMethod
    fun openAppNotificationSettings() {
        startSettingsActivity(
            reactApplicationContext,
            Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
                putExtra(Settings.EXTRA_APP_PACKAGE, reactApplicationContext.packageName)
            }
        )
    }
}
