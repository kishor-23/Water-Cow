package com.watercow.app

import android.content.Context

object WaterCowWidgetHelper {
    private const val PREFS_NAME = "WaterCowWidgetPrefs"
    private const val KEY_CONSUMED_ML = "consumed_ml"
    private const val KEY_GOAL_ML = "goal_ml"
    private const val KEY_DATE = "date_key"

    fun getConsumedMl(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_CONSUMED_ML, 0)
    }

    fun getGoalMl(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_GOAL_ML, 2000)
    }

    fun getTodayKey(): String {
        val sdf = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US)
        return sdf.format(java.util.Date())
    }

    fun ensureDate(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val todayKey = getTodayKey()
        val savedDate = prefs.getString(KEY_DATE, "")
        if (savedDate != todayKey) {
            prefs.edit().putString(KEY_DATE, todayKey).putInt(KEY_CONSUMED_ML, 0).apply()
        }
    }
}
