package com.watercow.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class WaterCowWidgetProvider : AppWidgetProvider() {

    companion object {
        const val PREFS_NAME = "WaterCowWidgetPrefs"
        const val KEY_CONSUMED_ML = "consumed_ml"
        const val KEY_GOAL_ML = "goal_ml"
        const val KEY_DATE = "date_key"
        const val KEY_PENDING_QUICK_ADDS = "pending_quick_adds"
        const val ACTION_QUICK_ADD_WATER = "com.watercow.app.ACTION_QUICK_ADD_WATER"

        fun getTodayKey(): String {
            val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
            return sdf.format(Date())
        }

        fun updateAllWidgets(context: Context) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val thisWidget = ComponentName(context, WaterCowWidgetProvider::class.java)
            val allWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget)
            for (widgetId in allWidgetIds) {
                updateAppWidget(context, appWidgetManager, widgetId)
            }
        }

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val todayKey = getTodayKey()
            val savedDate = prefs.getString(KEY_DATE, "")

            var consumedMl = prefs.getInt(KEY_CONSUMED_ML, 0)
            val goalMl = prefs.getInt(KEY_GOAL_ML, 2000)

            // If new day, reset consumed
            if (savedDate != todayKey) {
                consumedMl = 0
                prefs.edit().putString(KEY_DATE, todayKey).putInt(KEY_CONSUMED_ML, 0).apply()
            }

            val litersConsumed = consumedMl / 1000.0
            val litersGoal = goalMl / 1000.0
            val percent = if (goalMl > 0) Math.min(100, (consumedMl * 100) / goalMl) else 0

            val views = RemoteViews(context.packageName, R.layout.watercow_widget)

            // Texts
            views.setTextViewText(R.id.widget_liters_text, String.format(Locale.US, "%.1f L", litersConsumed))
            views.setTextViewText(
                R.id.widget_goal_subtext,
                String.format(Locale.US, "of %.1f L Goal (%d%%)", litersGoal, percent)
            )

            // Date text
            val dateFmt = SimpleDateFormat("EEE, MMM d", Locale.US)
            views.setTextViewText(R.id.widget_date, dateFmt.format(Date()))

            // Progress Bar
            views.setProgressBar(R.id.widget_progress_bar, 100, percent, false)

            // Intent to open Main App
            val openAppIntent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val openAppPendingIntent = PendingIntent.getActivity(
                context,
                0,
                openAppIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, openAppPendingIntent)


            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == ACTION_QUICK_ADD_WATER) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val todayKey = getTodayKey()
            val savedDate = prefs.getString(KEY_DATE, "")
            if (savedDate != todayKey) {
                prefs.edit().putString(KEY_DATE, todayKey).putInt(KEY_CONSUMED_ML, 0).apply()
            }
            val consumed = prefs.getInt(KEY_CONSUMED_ML, 0) + 250
            val pending = prefs.getInt(KEY_PENDING_QUICK_ADDS, 0) + 1
            prefs.edit()
                .putInt(KEY_CONSUMED_ML, consumed)
                .putInt(KEY_PENDING_QUICK_ADDS, pending)
                .apply()
            updateAllWidgets(context)
        }
    }
}
