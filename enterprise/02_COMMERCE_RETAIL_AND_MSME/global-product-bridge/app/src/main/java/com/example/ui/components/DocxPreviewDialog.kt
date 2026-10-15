package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.data.model.CapitalPlan
import com.example.data.model.GlobalPartner
import com.example.data.model.LaunchProject
import com.example.data.model.TrustEvidence
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldDark
import com.example.ui.theme.GoldPrimary
import com.example.ui.theme.Navy800
import com.example.ui.theme.Navy900
import com.example.ui.theme.Slate100
import com.example.ui.theme.Slate200
import com.example.ui.theme.Slate400
import com.example.ui.theme.Slate600
import com.example.ui.theme.Slate800
import com.example.ui.theme.Slate900

@Composable
fun DocxPreviewDialog(
    project: LaunchProject,
    evidenceList: List<TrustEvidence>,
    partnerList: List<GlobalPartner>,
    capitalPlan: CapitalPlan?,
    onDismiss: () -> Unit,
    onDownloadDocx: () -> Unit,
    modifier: Modifier = Modifier
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.92f)
                .clip(RoundedCornerShape(20.dp)),
            color = Color.White,
            tonalElevation = 8.dp
        ) {
            Column(
                modifier = Modifier.fillMaxWidth()
            ) {
                // Header Bar
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
                        Column {
                            Text(
                                text = "OFFICIAL LAUNCH DOSSIER",
                                color = GoldPrimary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = "Generated DOCX Document ❶",
                                color = Color.White,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                        }

                        IconButton(
                            onClick = onDismiss,
                            modifier = Modifier.testTag("close_docx_dialog")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Close",
                                tint = Color.White
                            )
                        }
                    }
                }

                // Scrollable Document Sheet
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .background(Slate100)
                        .padding(16.dp)
                        .verticalScroll(rememberScrollState())
                ) {
                    // Document Paper
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(20.dp)
                        ) {
                            // Doc Header
                            Text(
                                text = "GLOBAL PRODUCT OPERATING SYSTEM",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.2.sp,
                                color = Navy900
                            )
                            Text(
                                text = "GLOBAL LAUNCH PROJECT & TRUST PROFILE DOSSIER",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Black,
                                color = GoldDark
                            )
                            Text(
                                text = "From Local Capability \u2192 Globally Trusted Product",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium,
                                color = Slate600
                            )

                            Spacer(modifier = Modifier.height(12.dp))
                            HorizontalDivider(color = Slate200)
                            Spacer(modifier = Modifier.height(12.dp))

                            // Corridor info
                            Text(
                                text = "1. EXECUTIVE PRODUCT CORRIDOR",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Navy800
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "\u2022 Title: ${project.title}\n" +
                                        "\u2022 Origin: ${project.originCountry} | Target Market: ${project.targetCountry}\n" +
                                        "\u2022 Category: ${project.category}\n" +
                                        "\u2022 Overall Readiness: ${project.overallReadiness}% (Website ${project.websiteReadiness}%, Compliance ${project.complianceReadiness}%, Supply ${project.supplyReadiness}%, Distribution ${project.distributionReadiness}%)\n" +
                                        "\u2022 Batch Provenance: ${project.batchCode}",
                                fontSize = 12.sp,
                                lineHeight = 18.sp,
                                color = Slate800
                            )

                            Spacer(modifier = Modifier.height(16.dp))
                            HorizontalDivider(color = Slate200)
                            Spacer(modifier = Modifier.height(16.dp))

                            // Trust Profile
                            Text(
                                text = "2. GLOBAL TRUST PROFILE (${evidenceList.size} AUDITED EVIDENCE VECTORS)",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Navy800
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            evidenceList.forEach { ev ->
                                Row(
                                    modifier = Modifier.padding(vertical = 4.dp),
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = null,
                                        tint = if (ev.status == "VERIFIED") EmeraldSuccess else GoldDark,
                                        modifier = Modifier.size(16.dp).padding(top = 2.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Column {
                                        Text(
                                            text = "${ev.title} [${ev.status}]",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Slate900
                                        )
                                        Text(
                                            text = ev.detail,
                                            fontSize = 11.sp,
                                            lineHeight = 15.sp,
                                            color = Slate600
                                        )
                                        Text(
                                            text = "Ref: ${ev.issuerOrEvidence} | ${ev.evidenceHash}",
                                            fontSize = 10.sp,
                                            fontFamily = FontFamily.Monospace,
                                            color = Slate400
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(16.dp))
                            HorizontalDivider(color = Slate200)
                            Spacer(modifier = Modifier.height(16.dp))

                            // Regulatory & Logistics
                            Text(
                                text = "3. REGULATORY STATUS & LOGISTICS",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Navy800
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "${project.regulatorySummary}\n\nSupply & Provenance: ${project.supplySummary}",
                                fontSize = 12.sp,
                                lineHeight = 17.sp,
                                color = Slate800
                            )

                            Spacer(modifier = Modifier.height(16.dp))
                            HorizontalDivider(color = Slate200)
                            Spacer(modifier = Modifier.height(16.dp))

                            // Global Partner Graph
                            Text(
                                text = "4. GLOBAL PARTNER GRAPH (FIT SCORES)",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Navy800
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            partnerList.take(4).forEach { p ->
                                Text(
                                    text = "\u2022 ${p.role}: ${p.name} (${p.organization}, ${p.location}) \u2014 Fit Score: ${p.totalFitScore}/100",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Slate900
                                )
                                Text(
                                    text = "  ${p.description}",
                                    fontSize = 11.sp,
                                    color = Slate600,
                                    modifier = Modifier.padding(bottom = 6.dp)
                                )
                            }

                            Spacer(modifier = Modifier.height(16.dp))
                            HorizontalDivider(color = Slate200)
                            Spacer(modifier = Modifier.height(16.dp))

                            // Capital Engine
                            Text(
                                text = "5. CAPITAL ENGINE & USE OF FUNDS",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Navy800
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            if (capitalPlan != null) {
                                Text(
                                    text = "Total Capital: \u20AC${capitalPlan.targetAmountEur} | Use of funds:\n" +
                                            "\u2022 Manufacturing: \u20AC${capitalPlan.manufacturingEur}\n" +
                                            "\u2022 EU Compliance/CPSR: \u20AC${capitalPlan.complianceEur}\n" +
                                            "\u2022 Inventory/3PL: \u20AC${capitalPlan.inventoryEur}\n" +
                                            "\u2022 Marketing & Discovery Sets: \u20AC${capitalPlan.marketingEur}\n" +
                                            "\u2022 Selective Retail Placement: \u20AC${capitalPlan.distributionEur}\n\n" +
                                            "Advisory: ${capitalPlan.stageFitRecommendation}",
                                    fontSize = 12.sp,
                                    lineHeight = 17.sp,
                                    color = Slate800
                                )
                            }
                        }
                    }
                }

                // Footer Actions
                Surface(
                    color = Color.White,
                    tonalElevation = 4.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedButton(
                            onClick = onDismiss,
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Dismiss")
                        }

                        Button(
                            onClick = onDownloadDocx,
                            colors = ButtonDefaults.buttonColors(containerColor = GoldPrimary, contentColor = Navy900),
                            modifier = Modifier
                                .weight(1.5f)
                                .testTag("modal_download_docx_action")
                        ) {
                            Icon(imageVector = Icons.Default.Download, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Download DOCX ❶", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
