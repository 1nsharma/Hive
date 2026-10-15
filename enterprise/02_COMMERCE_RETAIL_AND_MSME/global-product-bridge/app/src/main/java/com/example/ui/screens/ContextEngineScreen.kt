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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountTree
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Hub
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
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
import com.example.data.model.FounderIdentity
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
fun ContextEngineScreen(
    identity: FounderIdentity?,
    modifier: Modifier = Modifier
) {
    val defaultIdentity = identity ?: FounderIdentity(
        id = "primary_founder",
        username = "amit.sharma",
        fullName = "Amit Sharma",
        companyName = "Kannauj Terroir Parfums Pvt Ltd",
        originCityCountry = "Kannauj & New Delhi, India",
        headline = "Heritage Perfume Formulator & Cross-Border Brand Architect",
        globalTrustScore = 88,
        skillsSummary = "Hydro-distillation chemistry, IFRA safety compliance, French market entry, DTC cross-border supply chains.",
        ipSummary = "Kannauj GI registered, Madrid Protocol Class 3 trademark, proprietary low-temperature distillation enfleurage protocol.",
        reputationProof = "13/13 Verifiable Evidence Vectors documented. Full dossier compiled and verified via Global Product OS."
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Slate100)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Hero Card: Global Identity
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Navy900),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
            modifier = Modifier.fillMaxWidth().testTag("identity_hero_card")
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
                                imageVector = Icons.Default.Badge,
                                contentDescription = null,
                                tint = GoldPrimary,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "GLOBAL IDENTITY PROFILE",
                                color = GoldSecondary,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.8.sp
                            )
                        }
                    }

                    Text(
                        text = "Unified Trust Passport",
                        color = Slate400,
                        fontSize = 11.sp
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(52.dp)
                            .clip(CircleShape)
                            .background(GoldPrimary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "AS",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black,
                            color = Navy900
                        )
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = defaultIdentity.fullName,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Icon(
                                imageVector = Icons.Default.VerifiedUser,
                                contentDescription = "Verified",
                                tint = EmeraldSuccess,
                                modifier = Modifier.size(16.dp)
                            )
                        }

                        Text(
                            text = "@${defaultIdentity.username}",
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace,
                            color = GoldSecondary
                        )

                        Text(
                            text = "${defaultIdentity.companyName} \u2022 ${defaultIdentity.originCityCountry}",
                            fontSize = 11.sp,
                            color = Slate400
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "\u201CUsername = Person + Company + Knowledge + Relationships + Products + Credentials + IP + Transactions + Reputation.\u201D",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = Slate200,
                    lineHeight = 17.sp
                )

                Spacer(modifier = Modifier.height(10.dp))

                Surface(
                    color = Navy800,
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = "GLOBAL TRUST REPUTATION", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                            Text(text = "Tier-1 Authenticated (${defaultIdentity.globalTrustScore}/100)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = EmeraldSuccess)
                        }

                        Surface(
                            color = EmeraldContainer,
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = "13/13 AUDITED",
                                color = EmeraldSuccess,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                            )
                        }
                    }
                }
            }
        }

        // The 5 Moat Graphs
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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.AccountTree, contentDescription = null, tint = GoldDark)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "THE 5 MOAT GRAPHS OF GLOBAL PRODUCT OS",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.8.sp,
                        color = Slate600
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                MoatGraphItem(
                    number = "1",
                    title = "Global Knowledge Graph",
                    detail = "Regulations, consumer preference, market gaps, standards, and import tariffs across 40+ international corridors."
                )

                MoatGraphItem(
                    number = "2",
                    title = "Founder / Product Graph",
                    detail = "Mapping raw artisan capability in Kannauj/Bengaluru to finished luxury formulations and enterprise software standards."
                )

                MoatGraphItem(
                    number = "3",
                    title = "Trust Graph",
                    detail = "Cryptographic ledger of 13 verifiable evidence vectors (GI certification, GC-MS testing, IFRA safety audits, corporate standing)."
                )

                MoatGraphItem(
                    number = "4",
                    title = "Partner Graph",
                    detail = "Destination network nodes scored by Fit Score (Product \u00D7 Market \u00D7 Geo \u00D7 Capability \u00D7 Trust \u00D7 Cost \u00D7 Availability)."
                )

                MoatGraphItem(
                    number = "5",
                    title = "Execution Graph",
                    detail = "Step-by-step real-world tracking: Deg hydro-distillation \u2192 Batch #001 \u2192 CPSR dossier \u2192 CPNP \u2192 Roissy 3PL \u2192 Paris Boutique DTC."
                )
            }
        }

        // 3-Layer Business Model
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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Layers, contentDescription = null, tint = Navy900)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "3-TIER OPERATING SYSTEM BUSINESS MODEL",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.8.sp,
                        color = Slate600
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                TierItem(
                    name = "Tier 1: Founder Layer (Free / Low Cost)",
                    desc = "Global Trust Profile generation, readiness scorecard, corridor gap identification, and foundational launch roadmap."
                )

                TierItem(
                    name = "Tier 2: Pro Layer (SaaS Subscription)",
                    desc = "Continuous regulatory monitoring, partner graph algorithmic matching, dossier management, and automated export paperwork."
                )

                TierItem(
                    name = "Tier 3: Execution Layer (Transaction & Service Fee)",
                    desc = "Customs clearance, Responsible Person retention, 3PL fulfillment coordination, escrow, and retail distributor commission."
                )
            }
        }

        Spacer(modifier = Modifier.height(40.dp))
    }
}

@Composable
fun MoatGraphItem(number: String, title: String, detail: String) {
    Row(
        modifier = Modifier.padding(vertical = 6.dp),
        verticalAlignment = Alignment.Top
    ) {
        Surface(
            color = Navy900,
            shape = CircleShape,
            modifier = Modifier.size(22.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Text(text = number, color = GoldPrimary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }
        }
        Spacer(modifier = Modifier.width(10.dp))
        Column {
            Text(text = title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Slate900)
            Text(text = detail, fontSize = 11.sp, lineHeight = 16.sp, color = Slate600)
        }
    }
}

@Composable
fun TierItem(name: String, desc: String) {
    Column(modifier = Modifier.padding(vertical = 5.dp)) {
        Text(text = name, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Navy900)
        Text(text = desc, fontSize = 11.sp, lineHeight = 16.sp, color = Slate600)
        Spacer(modifier = Modifier.height(4.dp))
        HorizontalDivider(color = Slate100)
    }
}
