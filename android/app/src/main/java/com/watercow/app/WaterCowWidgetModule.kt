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
    fun setQuickAddAmount(amountMl: Double) {
        val prefs = reactContext.getSharedPreferences(
            WaterCowWidgetProvider.PREFS_NAME,
            Context.MODE_PRIVATE
        )
        prefs.edit()
            .putInt(WaterCowWidgetProvider.KEY_QUICK_ADD_AMOUNT, amountMl.toInt())
            .apply()

        WaterCowWidgetProvider.updateAllWidgets(reactContext)
    }

    @ReactMethod
    fun getPendingQuickAdds(promise: Promise) {
        val prefs = reactContext.getSharedPreferences(
            WaterCowWidgetProvider.PREFS_NAME,
            Context.MODE_PRIVATE
        )
        val pendingMl = prefs.getInt(WaterCowWidgetProvider.KEY_PENDING_QUICK_ADD_ML, 0)
        val count = prefs.getInt(WaterCowWidgetProvider.KEY_PENDING_QUICK_ADDS, 0)
        val defaultAmount = prefs.getInt(WaterCowWidgetProvider.KEY_QUICK_ADD_AMOUNT, 250)

        val totalMl = if (pendingMl > 0) pendingMl else (count * defaultAmount)

        if (totalMl > 0 || count > 0) {
            prefs.edit()
                .putInt(WaterCowWidgetProvider.KEY_PENDING_QUICK_ADDS, 0)
                .putInt(WaterCowWidgetProvider.KEY_PENDING_QUICK_ADD_ML, 0)
                .apply()
        }
        promise.resolve(totalMl)
    }
}
