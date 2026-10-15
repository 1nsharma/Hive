package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.LaunchProject
import com.example.ui.theme.GoldPrimary
import com.example.ui.theme.GoldSecondary
import com.example.ui.theme.Navy800
import com.example.ui.theme.Navy900
import com.example.ui.theme.Slate200
import com.example.ui.theme.Slate400
import com.example.ui.theme.Slate700

@Composable
fun GlobalHeader(
    projects: List<LaunchProject>,
    selectedProjectId: String,
    onSelectProject: (String) -> Unit,
    onOpenAiAdvisor: () -> Unit,
    onExportDocx: () -> Unit,
    onOpenDocxPreview: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        color = Navy900,
        tonalElevation = 6.dp,
        modifier = modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp)
        ) {
            // Top Row: Brand & Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(
                                Brush.linearGradient(
                                    listOf(GoldPrimary, GoldSecondary)
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Language,
                            contentDescription = "Global Bridge",
                            tint = Navy900,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column {
                        Text(
                            text = "GLOBAL PRODUCT BRIDGE",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = 1.sp,
                            color = Color.White
                        )
                        Text(
                            text = "Local Capability \u2192 Globally Trusted",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = GoldSecondary
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    // AI Co-pilot trigger
                    IconButton(
                        onClick = onOpenAiAdvisor,
                        modifier = Modifier.testTag("ai_advisor_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = "AI Globalization Co-Pilot",
                            tint = GoldPrimary
                        )
                    }

                    // DOCX Download Button
                    Button(
                        onClick = onExportDocx,
                        shape = RoundedCornerShape(20.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = GoldPrimary,
                            contentColor = Navy900
                        ),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(
                            horizontal = 12.dp,
                            vertical = 6.dp
                        ),
                        modifier = Modifier
                            .height(36.dp)
                            .testTag("download_docx_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Download,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "DOCX \u2776",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Corridors Horizontal Bar
            Text(
                text = "ACTIVE GLOBAL CORRIDORS:",
                fontSize = 10.sp,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 0.8.sp,
                color = Slate400,
                modifier = Modifier.padding(bottom = 6.dp)
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                projects.forEach { project ->
                    val isSelected = project.id == selectedProjectId
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = if (isSelected) GoldSecondary else Navy800,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (isSelected) GoldPrimary else Slate700
                        ),
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .clickable { onSelectProject(project.id) }
                            .testTag("corridor_chip_${project.id}")
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            if (project.isFlagship) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .clip(CircleShape)
                                        .background(if (isSelected) Navy900 else GoldPrimary)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                            }
                            Text(
                                text = "${project.originCountry} \u2192 ${project.targetCountry}",
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Navy900 else Slate200
                            )
                        }
                    }
                }
            }
        }
    }
}
