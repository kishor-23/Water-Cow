package com.watercow.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.media.AudioAttributes
import android.net.Uri
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WaterCowNotificationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val CHANNEL_ID = "watercow_reminder_channel"
        const val CHANNEL_NAME = "WaterCow Reminders"
        const val PREFS_NAME = "WaterCowNotificationPrefs"
        const val KEY_SOUND = "notification_sound"
        const val DEFAULT_SOUND = "cow_moo.mp3"
    }

    init {
        // Ensure static R.raw references exist so R8 resource shrinker preserves sound files
        keepSoundResources()
        // Ensure the channel exists when the module is instantiated
        createNotificationChannel(getCurrentSound())
    }

    private fun keepSoundResources(): Int {
        // Explicitly reference raw resource IDs so AGP/R8 never strips them in release builds
        return R.raw.cow_moo + R.raw.cow_bell
    }

    override fun getName(): String = "WaterCowNotification"

    private fun getCurrentSound(): String {
        val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        // Stored value may include extension; strip it for raw resource lookup
        val rawName = prefs.getString(KEY_SOUND, DEFAULT_SOUND) ?: DEFAULT_SOUND
        return rawName.substringBeforeLast('.')
    }

    private fun createNotificationChannel(soundFileName: String) {
        val manager = reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        // Re‑create channel to ensure new sound is applied
        manager.deleteNotificationChannel(CHANNEL_ID)
        val soundResName = soundFileName.substringBeforeLast('.') // ensure no extension
        val soundUri = Uri.parse("android.resource://${reactContext.packageName}/raw/${soundResName}")
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_NOTIFICATION)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()
        val channel = NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH).apply {
            setSound(soundUri, audioAttributes)
        }
        manager.createNotificationChannel(channel)
    }

    /**
     * Change the sound used for reminder notifications at runtime.
     * The sound file must exist in `assets/sounds/`.
     */
    @ReactMethod
    fun setNotificationSound(soundFileName: String) {
        // Persist choice
        val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        // Store without extension for consistency
        val rawName = soundFileName.substringBeforeLast('.')
        prefs.edit().putString(KEY_SOUND, rawName).apply()
        // Recreate channel with new sound
        createNotificationChannel(rawName)
    }

    /**
     * Send a simple reminder notification. This method can be expanded later.
     */
    @ReactMethod
    fun sendReminderNotification(title: String, message: String) {
        val builder = NotificationCompat.Builder(reactContext, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
        val manager = reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify((System.currentTimeMillis() % Int.MAX_VALUE).toInt(), builder.build())
    }
}
