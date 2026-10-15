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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Hub
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
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
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.GlobalPartner
import com.example.ui.theme.EmeraldLight
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldContainer
import com.example.ui.theme.GoldDark
import com.example.ui.theme.GoldLight
import com.example.ui.theme.GoldPrimary
import com.example.ui.theme.GoldSecondary
import com.example.ui.theme.Navy800
import com.example.ui.theme.Navy900
import com.example.ui.theme.Slate50
import com.example.ui.theme.Slate100
import com.example.ui.theme.Slate200
import com.example.ui.theme.Slate400
import com.example.ui.theme.Slate500
import com.example.ui.theme.Slate600
import com.example.ui.theme.Slate700
import com.example.ui.theme.Slate800
import com.example.ui.theme.Slate900

@Composable
fun PartnerGraphScreen(
    partnerList: List<GlobalPartner>,
    searchQuery: String,
    onSearchChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(Slate100)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Partner Graph Header
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Navy900),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                modifier = Modifier.fillMaxWidth()
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
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Hub,
                                    contentDescription = null,
                                    tint = GoldPrimary,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "GLOBAL PARTNER GRAPH",
                                    color = GoldSecondary,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.8.sp
                                )
                            }
                        }

                        Text(
                            text = "Algorithmic Match Engine",
                            color = Slate400,
                            fontSize = 11.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Bridging the International Network Disadvantage",
                        color = Color.White,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Black
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = "Instead of cold messaging on LinkedIn, the system matches your specific launch requirements directly into destination market partners using the multi-vector Fit Score formula:",
                        color = Slate200,
                        fontSize = 12.sp,
                        lineHeight = 17.sp
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Surface(
                        color = Navy800,
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, GoldContainer),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "FIT SCORE = Product Fit \u00D7 Market Fit \u00D7 Geography \u00D7 Capability \u00D7 Trust \u00D7 Cost \u00D7 Availability",
                            color = GoldPrimary,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp,
                            modifier = Modifier.padding(10.dp)
                        )
                    }
                }
            }
        }

        // Search Bar
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = onSearchChange,
                placeholder = { Text("Search by role, name, Paris/Roissy location...", fontSize = 13.sp) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Slate400) },
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White,
                    focusedBorderColor = GoldPrimary,
                    unfocusedBorderColor = Slate200
                ),
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("partner_search_input")
            )
        }

        item {
            Text(
                text = "MATCHED CORRIDOR PARTNERS (${partnerList.size})",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.8.sp,
                color = Slate600
            )
        }

        // Partner Cards
        items(partnerList, key = { it.id }) { partner ->
            PartnerCard(partner = partner)
        }

        item {
            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}

@Composable
fun PartnerCard(partner: GlobalPartner) {
    var isExpanded by remember { mutableStateOf(false) }
    var copied by remember { mutableStateOf(false) }
    val clipboardManager = LocalClipboardManager.current

    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier
            .fillMaxWidth()
            .testTag("partner_card_${partner.id}")
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Surface(
                        color = GoldLight,
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = partner.role,
                            color = GoldDark,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = partner.name,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate900
                        )
                        if (partner.isVerified) {
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(
                                imageVector = Icons.Default.Verified,
                                contentDescription = "Verified Partner",
                                tint = EmeraldSuccess,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(imageVector = Icons.Default.Business, contentDescription = null, tint = Slate400, modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = partner.organization,
                            fontSize = 12.sp,
                            color = Slate700,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Icon(imageVector = Icons.Default.LocationOn, contentDescription = null, tint = Slate400, modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(2.dp))
                        Text(
                            text = partner.location,
                            fontSize = 11.sp,
                            color = Slate500
                        )
                    }
                }

                // Fit Score Pill
                Surface(
                    color = Navy900,
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "${partner.totalFitScore}%",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Black,
                            color = GoldPrimary
                        )
                        Text(
                            text = "FIT SCORE",
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate400
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = partner.description,
                fontSize = 12.sp,
                lineHeight = 17.sp,
                color = Slate700
            )

            Spacer(modifier = Modifier.height(12.dp))

            // 7 Vector Fit Breakdown mini-indicators
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                FitMetricMini("Product", partner.productFit)
                FitMetricMini("Market", partner.marketFit)
                FitMetricMini("Geo", partner.geographyFit)
                FitMetricMini("Capability", partner.capabilityFit)
                FitMetricMini("Trust", partner.trustFit)
                FitMetricMini("Cost", partner.costFit)
                FitMetricMini("Available", partner.availabilityFit)
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Expandable Pitch Brief
            Surface(
                color = Slate50,
                shape = RoundedCornerShape(8.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(10.dp)) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { isExpanded = !isExpanded },
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.AutoMirrored.Filled.Send, contentDescription = null, tint = GoldDark, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Actionable Pitch Brief & Status: ${partner.outreachStatus}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate800
                            )
                        }

                        Text(
                            text = if (isExpanded) "Hide" else "View Brief",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = GoldDark
                        )
                    }

                    AnimatedVisibility(visible = isExpanded) {
                        Column(modifier = Modifier.padding(top = 8.dp)) {
                            Text(
                                text = partner.samplePitchBrief,
                                fontSize = 11.sp,
                                lineHeight = 16.sp,
                                color = Slate700
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Button(
                                onClick = {
                                    clipboardManager.setText(AnnotatedString(partner.samplePitchBrief))
                                    copied = true
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Navy800, contentColor = Color.White),
                                shape = RoundedCornerShape(6.dp),
                                modifier = Modifier.fillMaxWidth().height(34.dp)
                            ) {
                                Icon(
                                    imageVector = if (copied) Icons.Default.Check else Icons.Default.ContentCopy,
                                    contentDescription = null,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = if (copied) "Brief Copied to Clipboard" else "Copy Outreach Pitch Brief",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun FitMetricMini(label: String, score: Int) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = "$score/10", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate800)
        Text(text = label, fontSize = 8.sp, color = Slate500)
    }
}
