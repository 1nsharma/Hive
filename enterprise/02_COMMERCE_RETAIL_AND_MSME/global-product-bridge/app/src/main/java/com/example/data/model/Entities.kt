package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "launch_projects")
data class LaunchProject(
    @PrimaryKey val id: String,
    val title: String,
    val category: String,
    val originCountry: String,
    val targetCountry: String,
    val description: String,
    val overallReadiness: Int,
    val websiteReadiness: Int,
    val complianceReadiness: Int,
    val supplyReadiness: Int,
    val distributionReadiness: Int,
    val regulatorySummary: String,
    val supplySummary: String,
    val commercialSummary: String,
    val marketGapSummary: String,
    val targetCustomer: String,
    val priceBenchmark: String,
    val batchCode: String,
    val isFlagship: Boolean = false
)

@Entity(tableName = "trust_evidence")
data class TrustEvidence(
    @PrimaryKey val id: String,
    val projectId: String,
    val category: String,
    val title: String,
    val detail: String,
    val issuerOrEvidence: String,
    val status: String, // VERIFIED, IN_REVIEW, ACTION_REQUIRED
    val dateVerified: String,
    val evidenceHash: String,
    val weightPoints: Int = 8
)

@Entity(tableName = "global_partners")
data class GlobalPartner(
    @PrimaryKey val id: String,
    val corridor: String,
    val role: String,
    val name: String,
    val organization: String,
    val location: String,
    val description: String,
    val productFit: Int,
    val marketFit: Int,
    val geographyFit: Int,
    val capabilityFit: Int,
    val trustFit: Int,
    val costFit: Int,
    val availabilityFit: Int,
    val totalFitScore: Int,
    val isVerified: Boolean,
    val outreachStatus: String,
    val samplePitchBrief: String
)

@Entity(tableName = "capital_plans")
data class CapitalPlan(
    @PrimaryKey val id: String,
    val projectId: String,
    val targetAmountEur: Int,
    val manufacturingEur: Int,
    val complianceEur: Int,
    val inventoryEur: Int,
    val marketingEur: Int,
    val distributionEur: Int,
    val recommendedInstruments: String,
    val stageFitRecommendation: String
)

@Entity(tableName = "founder_identity")
data class FounderIdentity(
    @PrimaryKey val id: String = "primary_founder",
    val username: String,
    val fullName: String,
    val companyName: String,
    val originCityCountry: String,
    val headline: String,
    val globalTrustScore: Int,
    val skillsSummary: String,
    val ipSummary: String,
    val reputationProof: String
)
