package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.Policy
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.LaunchProject
import com.example.ui.theme.EmeraldContainer
import com.example.ui.theme.EmeraldLight
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldContainer
import com.example.ui.theme.GoldDark
import com.example.ui.theme.GoldLight
import com.example.ui.theme.GoldPrimary
import com.example.ui.theme.GoldSecondary
import com.example.ui.theme.Navy800
import com.example.ui.theme.Navy900
import com.example.ui.theme.Slate100
import com.example.ui.theme.Slate200
import com.example.ui.theme.Slate400
import com.example.ui.theme.Slate500
import com.example.ui.theme.Slate600
import com.example.ui.theme.Slate700
import com.example.ui.theme.Slate800
import com.example.ui.theme.Slate900

@Composable
fun DashboardScreen(
    project: LaunchProject?,
    onExportDocx: () -> Unit,
    onPreviewDocx: () -> Unit,
    onNavigateToTrustProfile: () -> Unit,
    onNavigateToPartners: () -> Unit,
    onNavigateToCapital: () -> Unit,
    onOpenAiAdvisor: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (project == null) {
        Box(
            modifier = modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text("Select or create a Global Launch Corridor to begin.")
        }
        return
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Slate100)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Hero Card: Download Generated DOCX Banner
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Navy900),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
            modifier = Modifier
                .fillMaxWidth()
                .testTag("docx_banner_card")
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(18.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Surface(
                        color = GoldContainer,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Description,
                                contentDescription = null,
                                tint = GoldPrimary,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "EXPORT READY \u2022 DOCX \u2776",
                                color = GoldSecondary,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            )
                        }
                    }

                    Text(
                        text = "Global Trust Dossier",
                        color = Slate400,
                        fontSize = 11.sp
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Download the generated DOCX \u2776",
                    color = Color.White,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black
                )

                Text(
                    text = "Complete internationalization pack for ${project.originCountry} \u2192 ${project.targetCountry}: 13 verified evidence vectors, CPSR compliance roadmap, partner matches, and capital stage-fit analysis.",
                    color = Slate200,
                    fontSize = 12.sp,
                    lineHeight = 17.sp,
                    modifier = Modifier.padding(vertical = 6.dp)
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = onExportDocx,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = GoldPrimary,
                            contentColor = Navy900
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .weight(1.3f)
                            .height(44.dp)
                            .testTag("hero_download_docx_btn")
                    ) {
                        Icon(imageVector = Icons.Default.Download, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Download DOCX", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }

                    OutlinedButton(
                        onClick = onPreviewDocx,
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Slate600),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp)
                            .testTag("hero_preview_docx_btn")
                    ) {
                        Icon(imageVector = Icons.Default.Visibility, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "Preview", fontSize = 13.sp)
                    }
                }
            }
        }

        // Active Launch Overview Card
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(18.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.Top,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "${project.originCountry} \u2794 ${project.targetCountry}",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = GoldDark
                            )
                            if (project.isFlagship) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Surface(
                                    color = GoldLight,
                                    shape = RoundedCornerShape(4.dp)
                                ) {
                                    Text(
                                        text = "FLAGSHIP PROOF-OF-CONCEPT",
                                        color = GoldDark,
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = project.title,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = Slate900
                        )

                        Text(
                            text = project.category,
                            fontSize = 12.sp,
                            color = Slate500
                        )
                    }

                    // Circular / Big Overall Score Pill
                    Surface(
                        color = Navy900,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.padding(start = 8.dp)
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                        ) {
                            Text(
                                text = "${project.overallReadiness}%",
                                color = GoldPrimary,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black
                            )
                            Text(
                                text = "READINESS",
                                color = Slate400,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
                Text(
                    text = project.description,
                    fontSize = 13.sp,
                    lineHeight = 18.sp,
                    color = Slate700
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Readiness Progress Bars Grid
                Text(
                    text = "CORRIDOR EXECUTION READINESS",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.8.sp,
                    color = Slate500
                )
                Spacer(modifier = Modifier.height(8.dp))

                ReadinessBarItem("Website & Brand", project.websiteReadiness, "72%")
                ReadinessBarItem("EU Regulatory & Safety", project.complianceReadiness, "61%")
                ReadinessBarItem("Supply & Batch Provenance", project.supplyReadiness, "84%")
                ReadinessBarItem("Distribution & Selective Retail", project.distributionReadiness, "28%")
            }
        }

        // 4 Core Execution Workflows
        Text(
            text = "DECISION + EXECUTION ENGINES",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.8.sp,
            color = Slate600
        )

        // 1. Regulatory Engine
        ExecutionTrackCard(
            title = "Regulatory & Compliance Engine",
            icon = Icons.Default.Policy,
            badge = "CPSR / PIF / CPNP / RP",
            summary = project.regulatorySummary,
            accentColor = Color(0xFF3B82F6),
            actionLabel = "View Verified Trust Dossier",
            onClick = onNavigateToTrustProfile
        )

        // 2. Supply & Batch Engine
        ExecutionTrackCard(
            title = "Supply & Traceability Engine",
            icon = Icons.Default.Inventory2,
            badge = "Batch ${project.batchCode}",
            summary = project.supplySummary,
            accentColor = EmeraldSuccess,
            actionLabel = "Inspect Batch #001 & Evidence",
            onClick = onNavigateToTrustProfile
        )

        // 3. Commercial & Go-to-Market Engine
        ExecutionTrackCard(
            title = "Commercial & Positioning Engine",
            icon = Icons.Default.Storefront,
            badge = "Discovery Sets + DTC",
            summary = "${project.commercialSummary}\nTarget: ${project.targetCustomer}\nPricing: ${project.priceBenchmark}",
            accentColor = GoldDark,
            actionLabel = "Explore Capital & Unit Economics",
            onClick = onNavigateToCapital
        )

        // 4. Partner & Market Intelligence
        ExecutionTrackCard(
            title = "Global Partner Graph & Market Gap",
            icon = Icons.Default.LocalShipping,
            badge = "Fit Score Algorithmic Matching",
            summary = "${project.marketGapSummary}\nMatched: French RP, Roissy 3PL, Le Marais retail curators, and Trade Angels.",
            accentColor = Color(0xFF8B5CF6),
            actionLabel = "Open Partner Graph with Fit Scores",
            onClick = onNavigateToPartners
        )

        // AI Corridor Advisor Prompt Card
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = GoldLight),
            border = androidx.compose.foundation.BorderStroke(1.dp, GoldSecondary),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(GoldPrimary),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, tint = Navy900)
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "\u0906\u092A \u0915\u094D\u092F\u093E \u092C\u0928\u093E\u0928\u093E \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902?",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Navy900
                    )
                    Text(
                        text = "Ask AI to configure any corridor: India \u2192 France, US, Germany, Kenya \u2192 UK, or Korea \u2192 EU.",
                        fontSize = 11.sp,
                        lineHeight = 15.sp,
                        color = Slate700
                    )
                }

                Button(
                    onClick = onOpenAiAdvisor,
                    colors = ButtonDefaults.buttonColors(containerColor = Navy900, contentColor = Color.White),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Text("Ask AI", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        Spacer(modifier = Modifier.height(40.dp))
    }
}

@Composable
fun ReadinessBarItem(label: String, progress: Int, percentageText: String) {
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = label, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = Slate700)
            Text(text = percentageText, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
        }
        Spacer(modifier = Modifier.height(4.dp))
        LinearProgressIndicator(
            progress = { progress / 100f },
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = if (progress >= 70) EmeraldSuccess else if (progress >= 50) GoldDark else Color(0xFFE11D48),
            trackColor = Slate200
        )
    }
}

@Composable
fun ExecutionTrackCard(
    title: String,
    icon: ImageVector,
    badge: String,
    summary: String,
    accentColor: Color,
    actionLabel: String,
    onClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(34.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(accentColor.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = icon, contentDescription = null, tint = accentColor, modifier = Modifier.size(20.dp))
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = title,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate900
                    )
                }

                Surface(
                    color = Slate100,
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = badge,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate700,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = summary,
                fontSize = 12.sp,
                lineHeight = 17.sp,
                color = Slate700
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .clickable { onClick() }
                    .padding(vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = actionLabel,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = accentColor
                )
                Spacer(modifier = Modifier.width(4.dp))
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                    contentDescription = null,
                    tint = accentColor,
                    modifier = Modifier.size(14.dp)
                )
            }
        }
    }
}
