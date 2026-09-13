package com.watercow.app

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WaterCowWidgetModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "WaterCowWidget"

    @ReactMethod
    fun updateWidget(consumedMl: Double, goalMl: Double, dateKey: String) {
        val prefs = reactContext.getSharedPreferences(
            WaterCowWidgetProvider.PREFS_NAME,
            Context.MODE_PRIVATE
        )
        prefs.edit()
            .putInt(WaterCowWidgetProvider.KEY_CONSUMED_ML, consumedMl.toInt())
            .putInt(WaterCowWidgetProvider.KEY_GOAL_ML, goalMl.toInt())
            .putString(WaterCowWidgetProvider.KEY_DATE, dateKey)
            .apply()

        WaterCowWidgetProvider.updateAllWidgets(reactContext)
    }

    @ReactMethod
    fun getPendingQuickAdds(promise: Promise) {
        val prefs = reactContext.getSharedPreferences(
            WaterCowWidgetProvider.PREFS_NAME,
            Context.MODE_PRIVATE
        )
        val count = prefs.getInt(WaterCowWidgetProvider.KEY_PENDING_QUICK_ADDS, 0)
        if (count > 0) {
            prefs.edit().putInt(WaterCowWidgetProvider.KEY_PENDING_QUICK_ADDS, 0).apply()
        }
        promise.resolve(count)
    }
}
