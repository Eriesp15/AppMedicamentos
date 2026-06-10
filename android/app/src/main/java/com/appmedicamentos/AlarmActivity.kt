package com.appmedicamentos

import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class AlarmActivity : ReactActivity() {
    override fun getMainComponentName(): String = "AppMedicamentos"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        object : DefaultReactActivityDelegate(
            this,
            mainComponentName,
            fabricEnabled
        ) {
            override fun getLaunchOptions(): Bundle = alarmLaunchOptions()
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        prepareAlarmWindow()
        super.onCreate(savedInstanceState)
    }

    override fun onNewIntent(intent: android.content.Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
    }

    private fun prepareAlarmWindow() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        }

        window.addFlags(
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
        )
    }

    private fun alarmLaunchOptions(): Bundle {
        return Bundle().apply {
            putString("notificationId", intent.getStringExtra("notificationId"))
            putString("medicationId", intent.getStringExtra("medicationId"))
            putString("medicationName", intent.getStringExtra("medicationName"))
            putString("scheduledTime", intent.getStringExtra("scheduledTime"))
            putString("dosage", intent.getStringExtra("dosage"))
            putInt("snoozeMinutes", intent.getIntExtra("snoozeMinutes", 10))
            putString("alarmSound", intent.getStringExtra("alarmSound") ?: "default")
            putBoolean("fromNativeAlarm", intent.getBooleanExtra("fromNativeAlarm", false))
        }
    }
}
