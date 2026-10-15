package com.example.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Dangerous
import androidx.compose.material.icons.filled.MonetizationOn
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.Stars
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.CapitalPlan
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
import com.example.ui.theme.Slate100
import com.example.ui.theme.Slate200
import com.example.ui.theme.Slate400
import com.example.ui.theme.Slate500
import com.example.ui.theme.Slate600
import com.example.ui.theme.Slate700
import com.example.ui.theme.Slate800
import com.example.ui.theme.Slate900
import java.util.Locale

@Composable
fun CapitalEngineScreen(
    capitalPlan: CapitalPlan?,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Slate100)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Hero Card: Capital Engine
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Navy900),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
            modifier = Modifier.fillMaxWidth().testTag("capital_hero_card")
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
                                imageVector = Icons.Default.AccountBalance,
                                contentDescription = null,
                                tint = GoldPrimary,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "GLOBAL CAPITAL ENGINE",
                                color = GoldSecondary,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.8.sp
                            )
                        }
                    }

                    Text(
                        text = "Stage-Fit Financing",
                        color = Slate400,
                        fontSize = 11.sp
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Capital Architecture for International Launch",
                    color = Color.White,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = "Capital is not just 'raising money'; it is stage-fit structuring. For the India \u2192 France fragrance corridor, our €18 landed cost vs €145 retail creates an ideal non-dilutive financing window.",
                    color = Slate200,
                    fontSize = 12.sp,
                    lineHeight = 17.sp
                )

                Spacer(modifier = Modifier.height(12.dp))

                val total = capitalPlan?.targetAmountEur ?: 100000
                Surface(
                    color = Navy800,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(text = "TOTAL LAUNCH CAPITAL", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate400)
                            Text(
                                text = "\u20AC${String.format(Locale.US, "%,d", total)}",
                                fontSize = 26.sp,
                                fontWeight = FontWeight.Black,
                                color = GoldPrimary
                            )
                        }

                        Surface(
                            color = EmeraldContainer,
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(
                                text = "NON-DILUTIVE FIT",
                                color = EmeraldSuccess,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }
        }

        // Use of Funds Breakdown
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
                Text(
                    text = "USE OF FUNDS BREAKDOWN (\u20AC100,000 ALLOCATION)",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.8.sp,
                    color = Slate600
                )

                Spacer(modifier = Modifier.height(12.dp))

                val plan = capitalPlan ?: CapitalPlan(
                    id = "default",
                    projectId = "india-france-fragrance",
                    targetAmountEur = 100000,
                    manufacturingEur = 35000,
                    complianceEur = 22000,
                    inventoryEur = 18000,
                    marketingEur = 15000,
                    distributionEur = 10000,
                    recommendedInstruments = "",
                    stageFitRecommendation = ""
                )

                FundItem("1. Manufacturing & Hydro-Distillation", plan.manufacturingEur, plan.targetAmountEur, GoldDark)
                FundItem("2. EU Regulatory Dossier & Toxicologist", plan.complianceEur, plan.targetAmountEur, Color(0xFF3B82F6))
                FundItem("3. French 3PL Warehousing & Logistics", plan.inventoryEur, plan.targetAmountEur, EmeraldSuccess)
                FundItem("4. DTC Discovery Sets & Launch Samples", plan.marketingEur, plan.targetAmountEur, Color(0xFFEC4899))
                FundItem("5. Selective Retailer Placement & Margin", plan.distributionEur, plan.targetAmountEur, Color(0xFF8B5CF6))
            }
        }

        // Capital Stage-Fit Matrix
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
                Text(
                    text = "STAGE-FIT FINANCING MATRIX",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.8.sp,
                    color = Slate600
                )

                Spacer(modifier = Modifier.height(10.dp))

                StageFitRow(
                    stage = "Distributor Advance / PO Financing",
                    fitLevel = "OPTIMAL FIT",
                    fitColor = EmeraldSuccess,
                    detail = "French niche boutique buyers and retail distributors advance 40% on confirmed purchase orders. Non-dilutive, zero equity loss."
                )

                StageFitRow(
                    stage = "Trade & Export Grants (EPCG / MAI)",
                    fitLevel = "HIGH FIT",
                    fitColor = EmeraldSuccess,
                    detail = "Ministry of Commerce Market Access Initiative (MAI) reimburses up to 50% of foreign regulatory testing, CPSR, and overseas trade exhibition costs."
                )

                StageFitRow(
                    stage = "Strategic Cross-Border Angels",
                    fitLevel = "STRONG FIT",
                    fitColor = GoldDark,
                    detail = "Ex-LVMH or French luxury executives providing €30k-€50k angel check alongside valuable retail and PR introductions."
                )

                StageFitRow(
                    stage = "Venture Capital (Equity)",
                    fitLevel = "AVOID NOW",
                    fitColor = RoseError,
                    detail = "Do not give away 20% equity at the seed stage before proven repeat metrics in Paris. Scale sustainably with positive gross margins first."
                )
            }
        }

        // Unit Economics Summary Card
        Card(
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = GoldLight),
            border = androidx.compose.foundation.BorderStroke(1.dp, GoldSecondary),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Stars, contentDescription = null, tint = GoldDark)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "UNIT ECONOMICS & RUNWAY",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Navy900
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "\u2022 Landed Cost per 50ml Flacon in France: \u20AC18.20\n" +
                            "\u2022 Retail Price in Paris: \u20AC145.00 (Incl. French 20% VAT)\n" +
                            "\u2022 Net Realized Revenue: \u20AC120.80 (Gross Margin: 85%)\n" +
                            "\u2022 Discovery Set (5x2ml): \u20AC35.00 with \u20AC35 full-bottle voucher credit\n" +
                            "\u2022 Breakeven: 1,120 full flacons sold across Europe.",
                    fontSize = 12.sp,
                    lineHeight = 18.sp,
                    color = Slate800
                )
            }
        }

        Spacer(modifier = Modifier.height(40.dp))
    }
}

@Composable
fun FundItem(title: String, amount: Int, total: Int, color: Color) {
    val pct = if (total > 0) (amount.toFloat() / total.toFloat()) else 0f
    val pctInt = (pct * 100).toInt()

    Column(modifier = Modifier.padding(vertical = 5.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = title, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Slate800)
            Text(
                text = "\u20AC${String.format(Locale.US, "%,d", amount)} ($pctInt%)",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Slate900
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        LinearProgressIndicator(
            progress = { pct },
            modifier = Modifier
                .fillMaxWidth()
                .height(7.dp)
                .clip(RoundedCornerShape(3.5.dp)),
            color = color,
            trackColor = Slate200
        )
    }
}

@Composable
fun StageFitRow(
    stage: String,
    fitLevel: String,
    fitColor: Color,
    detail: String
) {
    Column(modifier = Modifier.padding(vertical = 6.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = stage, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Slate900)
            Surface(
                color = fitColor.copy(alpha = 0.15f),
                shape = RoundedCornerShape(4.dp)
            ) {
                Text(
                    text = fitLevel,
                    color = fitColor,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }
        }
        Spacer(modifier = Modifier.height(2.dp))
        Text(text = detail, fontSize = 11.sp, lineHeight = 16.sp, color = Slate600)
        Spacer(modifier = Modifier.height(6.dp))
        HorizontalDivider(color = Slate200)
    }
}
