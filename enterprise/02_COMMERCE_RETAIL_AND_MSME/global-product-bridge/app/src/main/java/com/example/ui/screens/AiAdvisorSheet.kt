package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.service.GlobalizationAnalysis
import com.example.ui.theme.EmeraldContainer
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
import com.example.ui.viewmodel.AiAnalysisUiState

@Composable
fun AiAdvisorSheet(
    state: AiAnalysisUiState,
    onAnalyze: (product: String, origin: String, target: String, category: String) -> Unit,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    var productName by remember { mutableStateOf("Kannauj Mitti Attar & Rose Parfumerie") }
    var originCountry by remember { mutableStateOf("India (Kannauj)") }
    var targetCountry by remember { mutableStateOf("France (Paris / EU)") }
    var category by remember { mutableStateOf("Luxury Fragrance & Cosmetics") }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.92f)
                .clip(RoundedCornerShape(20.dp)),
            color = Slate100,
            tonalElevation = 8.dp
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Header
                Surface(
                    color = Navy900,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(GoldPrimary),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.AutoAwesome,
                                    contentDescription = null,
                                    tint = Navy900,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "GLOBALIZATION CO-PILOT",
                                    color = GoldPrimary,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.sp
                                )
                                Text(
                                    text = "\u0906\u092A \u0915\u094D\u092F\u093E \u092C\u0928\u093E\u0928\u093E \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902?",
                                    color = Color.White,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        IconButton(
                            onClick = onDismiss,
                            modifier = Modifier.testTag("close_ai_advisor_btn")
                        ) {
                            Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                        }
                    }
                }

                // Scrollable Form & Analysis Results
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .padding(16.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Quick Preset Corridors
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        FilterChip(
                            selected = targetCountry.contains("France"),
                            onClick = {
                                productName = "Kannauj Mitti Attar & Rose Parfumerie"
                                originCountry = "India (Kannauj)"
                                targetCountry = "France (Paris / EU)"
                                category = "Luxury Fragrance & Cosmetics"
                            },
                            label = { Text("India \u2192 France (Fragrance)") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = Navy900,
                                selectedLabelColor = GoldPrimary
                            )
                        )

                        FilterChip(
                            selected = targetCountry.contains("United States"),
                            onClick = {
                                productName = "Zero-Latency Telemetry Engine"
                                originCountry = "India (Bengaluru)"
                                targetCountry = "United States (SF / NYC)"
                                category = "B2B SaaS & DevTools"
                            },
                            label = { Text("India \u2192 US (Enterprise SaaS)") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = Navy900,
                                selectedLabelColor = GoldPrimary
                            )
                        )

                        FilterChip(
                            selected = targetCountry.contains("Germany"),
                            onClick = {
                                productName = "Aerospace Grade CNC Titanium Components"
                                originCountry = "India (Pune / Coimbatore)"
                                targetCountry = "Germany (Bavaria)"
                                category = "Precision Manufacturing"
                            },
                            label = { Text("India \u2192 Germany (CNC Mfg)") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = Navy900,
                                selectedLabelColor = GoldPrimary
                            )
                        )
                    }

                    // Form Inputs
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            OutlinedTextField(
                                value = productName,
                                onValueChange = { productName = it },
                                label = { Text("Product / Capability Title") },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth().testTag("ai_input_product")
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                OutlinedTextField(
                                    value = originCountry,
                                    onValueChange = { originCountry = it },
                                    label = { Text("Origin (City / Country)") },
                                    singleLine = true,
                                    modifier = Modifier.weight(1f).testTag("ai_input_origin")
                                )

                                OutlinedTextField(
                                    value = targetCountry,
                                    onValueChange = { targetCountry = it },
                                    label = { Text("Target Market / Country") },
                                    singleLine = true,
                                    modifier = Modifier.weight(1f).testTag("ai_input_target")
                                )
                            }

                            OutlinedTextField(
                                value = category,
                                onValueChange = { category = it },
                                label = { Text("Product Category") },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth().testTag("ai_input_category")
                            )

                            Button(
                                onClick = {
                                    onAnalyze(productName, originCountry, targetCountry, category)
                                },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = GoldPrimary,
                                    contentColor = Navy900
                                ),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(44.dp)
                                    .testTag("ai_run_analysis_btn")
                            ) {
                                Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Analyze Corridor with Gemini OS", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        }
                    }

                    // Status and Results
                    when (state) {
                        is AiAnalysisUiState.Loading -> {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    CircularProgressIndicator(color = GoldPrimary)
                                    Spacer(modifier = Modifier.height(12.dp))
                                    Text(
                                        text = "Synthesizing cross-border knowledge graph, regulatory standards, partner matching & capital structure...",
                                        fontSize = 12.sp,
                                        color = Slate600,
                                        lineHeight = 16.sp
                                    )
                                }
                            }
                        }

                        is AiAnalysisUiState.Success -> {
                            AnalysisResultsCard(analysis = state.analysis)
                        }

                        is AiAnalysisUiState.Error -> {
                            Card(
                                colors = CardDefaults.cardColors(containerColor = Color(0xFFFFE4E6)),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = "Error: ${state.message}",
                                    color = Color(0xFFBE123C),
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(12.dp)
                                )
                            }
                        }

                        AiAnalysisUiState.Idle -> {
                            // Show initial helper prompt
                            Surface(
                                color = GoldLight,
                                shape = RoundedCornerShape(10.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, GoldSecondary),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Icon(imageVector = Icons.Default.Lightbulb, contentDescription = null, tint = GoldDark, modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "The AI Globalization Engine maps your local capability into destination market readiness, answering: What to build, Where to launch, Who to partner with, Required documents, and Stage-fit capital structure.",
                                        fontSize = 11.sp,
                                        color = Slate800,
                                        lineHeight = 16.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AnalysisResultsCard(analysis: GlobalizationAnalysis) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
        shape = RoundedCornerShape(14.dp),
        modifier = Modifier.fillMaxWidth().testTag("ai_results_card")
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = EmeraldContainer,
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = "SYNTHESIS COMPLETE",
                        color = EmeraldSuccess,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            AnalysisSection("1. What to Build", analysis.whatToBuild)
            AnalysisSection("2. Where to Launch", analysis.whereToLaunch)
            AnalysisSection("3. With Whom to Partner", analysis.withWhomToPartner)
            AnalysisSection("4. Key Documents Required", analysis.documentsNeeded)
            AnalysisSection("5. Regulations & Directives", analysis.regulations)
            AnalysisSection("6. Target Buyer Demographic", analysis.targetBuyers)
            AnalysisSection("7. Price Benchmark & Margins", analysis.priceBenchmark)
            AnalysisSection("8. Sales Channels & Distribution", analysis.channels)
            AnalysisSection("9. Capital Structure & Financing", analysis.capitalStrategy)

            Surface(
                color = GoldLight,
                shape = RoundedCornerShape(8.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, GoldSecondary),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(10.dp)) {
                    Text(
                        text = "CORE STRATEGIC ADVISORY",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = GoldDark
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = analysis.strategicAdvice,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Navy900
                    )
                }
            }
        }
    }
}

@Composable
fun AnalysisSection(title: String, body: String) {
    Column {
        Text(text = title, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Navy900)
        Spacer(modifier = Modifier.height(2.dp))
        Text(text = body, fontSize = 12.sp, lineHeight = 17.sp, color = Slate700)
    }
}
