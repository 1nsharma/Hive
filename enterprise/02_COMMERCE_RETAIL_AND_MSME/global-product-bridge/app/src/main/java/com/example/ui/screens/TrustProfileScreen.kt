package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.HourglassTop
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PriorityHigh
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.TrustEvidence
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
import com.example.ui.theme.RoseError
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
fun TrustProfileScreen(
    evidenceList: List<TrustEvidence>,
    activeFilter: String,
    onFilterChange: (String) -> Unit,
    onToggleEvidence: (TrustEvidence) -> Unit,
    onExportDocx: () -> Unit,
    modifier: Modifier = Modifier
) {
    val verifiedCount = evidenceList.count { it.status == "VERIFIED" }
    val inReviewCount = evidenceList.count { it.status == "IN_REVIEW" }
    val actionCount = evidenceList.count { it.status == "ACTION_REQUIRED" }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(Slate100)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Trust Engine Moat Hero Card
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
                                    imageVector = Icons.Default.Shield,
                                    contentDescription = null,
                                    tint = GoldPrimary,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "GLOBAL TRUST ENGINE",
                                    color = GoldSecondary,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.8.sp
                                )
                            }
                        }

                        Text(
                            text = "Verified Dossier",
                            color = Slate400,
                            fontSize = 11.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column {
                            Text(
                                text = "88 / 100",
                                fontSize = 32.sp,
                                fontWeight = FontWeight.Black,
                                color = GoldPrimary
                            )
                            Text(
                                text = "TIER-1 GLOBAL VERIFIED STATUS",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp,
                                color = EmeraldSuccess
                            )
                        }

                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                                .background(EmeraldContainer),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.VerifiedUser,
                                contentDescription = null,
                                tint = EmeraldSuccess,
                                modifier = Modifier.size(32.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "\u201CYou don't need to look foreign to go global. You need to become globally understandable, trusted and executable.\u201D",
                        color = Color.White,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        lineHeight = 18.sp
                    )

                    Text(
                        text = "The solution is not marketing; it is verifiable evidence infrastructure. When French buyers, retail curators or EU regulators evaluate your formulation, the system says: \u201CHere is the evidence.\u201D",
                        color = Slate200,
                        fontSize = 11.sp,
                        lineHeight = 16.sp,
                        modifier = Modifier.padding(top = 4.dp)
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = onExportDocx,
                        colors = ButtonDefaults.buttonColors(containerColor = GoldPrimary, contentColor = Navy900),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth().height(40.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Download Verified Trust Dossier (.DOCX)", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }
        }

        // Filter Pills
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(
                    "ALL" to "All (${evidenceList.size})",
                    "VERIFIED" to "Verified ($verifiedCount)",
                    "IN_REVIEW" to "In Review ($inReviewCount)",
                    "ACTION_REQUIRED" to "Action Needed ($actionCount)"
                ).forEach { (key, label) ->
                    val isSelected = activeFilter == key
                    FilterChip(
                        selected = isSelected,
                        onClick = { onFilterChange(key) },
                        label = {
                            Text(
                                text = label,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Navy900,
                            selectedLabelColor = GoldPrimary,
                            containerColor = Color.White,
                            labelColor = Slate700
                        ),
                        modifier = Modifier.testTag("filter_$key")
                    )
                }
            }
        }

        // Section Title
        item {
            Text(
                text = "13 VERIFIABLE EVIDENCE VECTORS (TAP TO TOGGLE AUDIT STATE)",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.8.sp,
                color = Slate600
            )
        }

        // Evidence Cards
        items(evidenceList, key = { it.id }) { evidence ->
            TrustEvidenceCard(
                evidence = evidence,
                onToggle = { onToggleEvidence(evidence) }
            )
        }

        item {
            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}

@Composable
fun TrustEvidenceCard(
    evidence: TrustEvidence,
    onToggle: () -> Unit
) {
    val (statusColor, statusBg, statusIcon) = when (evidence.status) {
        "VERIFIED" -> Triple(EmeraldSuccess, EmeraldLight, Icons.Default.CheckCircle)
        "IN_REVIEW" -> Triple(GoldDark, GoldLight, Icons.Default.HourglassTop)
        else -> Triple(RoseError, Color(0xFFFFE4E6), Icons.Default.PriorityHigh)
    }

    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onToggle() }
            .testTag("evidence_card_${evidence.id}")
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Surface(
                    color = Slate100,
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text(
                        text = evidence.category.replace("_", " "),
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate600,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }

                Surface(
                    color = statusBg,
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Icon(
                            imageVector = statusIcon,
                            contentDescription = null,
                            tint = statusColor,
                            modifier = Modifier.size(12.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = evidence.status.replace("_", " "),
                            color = statusColor,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = evidence.title,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Slate900
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = evidence.detail,
                fontSize = 12.sp,
                lineHeight = 17.sp,
                color = Slate700
            )

            Spacer(modifier = Modifier.height(10.dp))

            Surface(
                color = Slate50,
                shape = RoundedCornerShape(6.dp),
                border = androidx.compose.foundation.BorderStroke(0.8.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "ISSUER: ${evidence.issuerOrEvidence}",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate800
                        )
                        Text(
                            text = evidence.dateVerified,
                            fontSize = 10.sp,
                            color = Slate500
                        )
                    }

                    Spacer(modifier = Modifier.height(2.dp))

                    Text(
                        text = "Hash: ${evidence.evidenceHash}",
                        fontSize = 9.sp,
                        fontFamily = FontFamily.Monospace,
                        color = Slate400
                    )
                }
            }
        }
    }
}
