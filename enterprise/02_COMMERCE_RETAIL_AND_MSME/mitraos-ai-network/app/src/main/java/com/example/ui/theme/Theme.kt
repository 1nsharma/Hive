package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = SleekPrimaryDark,
    onPrimary = SleekOnPrimaryDark,
    primaryContainer = SleekPrimaryContainerDark,
    onPrimaryContainer = SleekOnPrimaryContainerDark,
    secondary = SleekSecondaryDark,
    onSecondary = SleekOnSecondaryDark,
    secondaryContainer = SleekSecondaryContainerDark,
    onSecondaryContainer = SleekOnSecondaryContainerDark,
    tertiary = GoldReward,
    background = SleekBackgroundDark,
    surface = SleekSurfaceDark,
    onBackground = SleekOnBackgroundDark,
    onSurface = SleekOnSurfaceDark,
    surfaceVariant = SleekSurfaceVariantDark,
    onSurfaceVariant = SleekOnSurfaceVariantDark,
    outline = SleekOutline,
    outlineVariant = SleekOutline
)

private val LightColorScheme = lightColorScheme(
    primary = SleekPrimary,
    onPrimary = SleekOnPrimary,
    primaryContainer = SleekPrimaryContainer,
    onPrimaryContainer = SleekOnPrimaryContainer,
    secondary = SleekSecondary,
    onSecondary = SleekOnSecondary,
    secondaryContainer = SleekSecondaryContainer,
    onSecondaryContainer = SleekOnSecondaryContainer,
    tertiary = GoldReward,
    background = SleekBackground,
    surface = SleekSurface,
    onBackground = SleekOnBackground,
    onSurface = SleekOnSurface,
    surfaceVariant = SleekSurfaceVariant,
    onSurfaceVariant = SleekOnSurfaceVariant,
    outline = SleekOutline,
    outlineVariant = SleekOutlineVariant
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Keep dynamic color disabled to guarantee our gorgeous Sleek Interface palette is highlighted
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit,
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
