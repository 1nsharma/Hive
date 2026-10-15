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

private val DarkColorScheme =
  darkColorScheme(
    primary = GoldSecondary,
    onPrimary = Navy900,
    primaryContainer = GoldContainer,
    onPrimaryContainer = GoldLight,
    secondary = GoldPrimary,
    onSecondary = Navy900,
    secondaryContainer = Navy700,
    onSecondaryContainer = Slate100,
    tertiary = EmeraldSuccess,
    onTertiary = Navy900,
    tertiaryContainer = EmeraldContainer,
    onTertiaryContainer = EmeraldLight,
    background = Navy900,
    onBackground = Slate100,
    surface = Navy800,
    onSurface = Slate100,
    surfaceVariant = Navy700,
    onSurfaceVariant = Slate300,
    outline = Slate600
  )

private val LightColorScheme =
  lightColorScheme(
    primary = Navy800,
    onPrimary = Slate50,
    primaryContainer = Slate100,
    onPrimaryContainer = Navy900,
    secondary = GoldDark,
    onSecondary = Slate50,
    secondaryContainer = GoldLight,
    onSecondaryContainer = Navy900,
    tertiary = EmeraldSuccess,
    onTertiary = Slate50,
    tertiaryContainer = EmeraldLight,
    onTertiaryContainer = EmeraldContainer,
    background = Slate50,
    onBackground = Slate900,
    surface = Color.White,
    onSurface = Slate900,
    surfaceVariant = Slate100,
    onSurfaceVariant = Slate700,
    outline = Slate300
  )

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = isSystemInDarkTheme(),
  // Dynamic color is available on Android 12+
  dynamicColor: Boolean = true,
  content: @Composable () -> Unit,
) {
  val colorScheme =
    when {
      dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
        val context = LocalContext.current
        if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
      }

      darkTheme -> DarkColorScheme
      else -> LightColorScheme
    }

  MaterialTheme(colorScheme = colorScheme, typography = Typography, content = content)
}
