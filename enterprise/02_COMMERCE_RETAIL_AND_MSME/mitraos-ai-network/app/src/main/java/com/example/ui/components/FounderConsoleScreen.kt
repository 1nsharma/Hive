package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.ui.viewmodel.SwarajViewModel

@Composable
fun FounderConsoleScreen(
    viewModel: SwarajViewModel,
    modifier: Modifier = Modifier
) {
    val isFounder = viewModel.isFounder()
    val email by viewModel.userEmail.collectAsStateWithLifecycle()
    val treasuryByFounder by viewModel.simulatedFounderLiquidity.collectAsStateWithLifecycle()
    val telemetryLogs by viewModel.consoleLogs.collectAsStateWithLifecycle()

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "FOUNDER ADMINISTRATIVE COMMAND CENTER",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.5.sp
            )
            Text(
                text = "Developer Desk",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Text(
                text = "Secure authority controls for the founder's account only. Manage system values, monitor live nodes, and review telemetry diagnostics.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 4.dp, bottom = 8.dp)
            )
        }

        if (!isFounder) {
            // Access Restricted State
            item {
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.3f)
                    ),
                    border = CardDefaults.outlinedCardBorder(),
                    modifier = Modifier.fillMaxWidth().testTag("access_denied_card")
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.Lock,
                            contentDescription = "Access Denied",
                            modifier = Modifier.size(56.dp),
                            tint = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "ADMIN ACCESS RESTRICTED",
                            fontWeight = FontWeight.ExtraBold,
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.error,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Access is restricted to the founder account AMITSHARMA99976@gmail.com. Standard accounts are locked from diagnostics controls.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(16.dp))

                        Card(
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text(
                                    "🔧 Developer Testing Tip:",
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Text(
                                    "Go to the 'Wallet & Credentials' tab, click the Switch Account icon in the top right, and log in with email 'AMITSHARMA99976@gmail.com' to unlock developer controls instantly!",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }
        } else {
            // Full Admin Console State

            // System KPI Cards Row
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // KPI Case 1
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("SYSTEM STATE", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            Spacer(modifier = Modifier.height(4.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(10.dp)
                                        .clip(RoundedCornerShape(5.dp))
                                        .background(Color(0xFF2E7D32))
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("ONLINE", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium, color = Color(0xFF2E7D32))
                            }
                        }
                    }

                    // KPI Case 2
                    Card(
                        modifier = Modifier.weight(1.2f),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("GEMINI CORE LATENCY", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("38 ms (STABLE)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.secondary)
                        }
                    }
                }
            }

            // System KPI Cards Row 2
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // KPI Case 3
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("SWARAJ RURAL NODES", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("1,482 Active Nodes", fontWeight = FontWeight.ExtraBold, style = MaterialTheme.typography.titleMedium)
                        }
                    }

                    // KPI Case 4
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("LINKED API KEY", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            Spacer(modifier = Modifier.height(4.dp))
                            val isKeyPreset = com.example.BuildConfig.GEMINI_API_KEY.isNotEmpty() && com.example.BuildConfig.GEMINI_API_KEY != "MY_GEMINI_API_KEY"
                            Text(
                                text = if (isKeyPreset) "PROD PRESIGN" else "FALLBACK MOCK",
                                fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.titleMedium,
                                color = if (isKeyPreset) Color(0xFF2E7D32) else MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
            }

            // Controller Form
            item {
                Card(
                    modifier = Modifier.fillMaxWidth().testTag("founder_controls_panel"),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = CardDefaults.outlinedCardBorder()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Settings, contentDescription = "Swaraj Settings", tint = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                "Live Project Parameter Injectors",
                                fontWeight = FontWeight.ExtraBold,
                                style = MaterialTheme.typography.titleMedium
                            )
                        }
                        Spacer(modifier = Modifier.height(12.dp))

                        // Slider or quick selector for virtual liquidity pool capacity
                        Text(
                            "Simulated Swaraj Treasury Total Allocation Size",
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.outline
                        )
                        Text(
                            "Current Setting: ₹${"%,.2f".format(treasuryByFounder)}",
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.primary,
                            style = MaterialTheme.typography.bodyLarge
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        Slider(
                            value = treasuryByFounder.toFloat(),
                            onValueChange = { viewModel.adminAdjustRewardPool(it.toDouble()) },
                            valueRange = 10000f..5000000f,
                            modifier = Modifier.testTag("treasury_slider")
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        HorizontalDivider()

                        Spacer(modifier = Modifier.height(12.dp))

                        // Quick trigger controls
                        Button(
                            onClick = { viewModel.adminMockAirdrop() },
                            modifier = Modifier.fillMaxWidth().testTag("airdrop_bonus_button"),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.secondary
                            )
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Star, contentDescription = "Airdrop Icon")
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Airdrop Standard +500 Token Bonus", fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        OutlinedButton(
                            onClick = { viewModel.adminClearAllWorlds() },
                            modifier = Modifier.fillMaxWidth().testTag("flush_telemetry_button")
                        ) {
                            Text("Flush System Diagnostics Logs")
                        }
                    }
                }
            }

            // Monospaced terminal window for simulated logs
            item {
                Text(
                    "REAL-TIME TRANSACTION LEDGER & TELEMETRY LOGS",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(4.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFF070B12))
                        .border(1.dp, Color(0xFF1B2C40), RoundedCornerShape(8.dp))
                        .padding(12.dp)
                ) {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        items(telemetryLogs) { log ->
                            Text(
                                text = log,
                                color = Color(0xFF00FFCC),
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            }
        }
    }
}
