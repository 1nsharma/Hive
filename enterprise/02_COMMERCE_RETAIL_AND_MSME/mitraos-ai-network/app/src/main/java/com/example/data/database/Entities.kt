package com.example.data.database

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "training_courses")
data class TrainingCourse(
    @PrimaryKey val id: String,
    val title: String,
    val category: String,
    val indianProblemState: String,
    val googleAiTechStack: String,
    val solutionBrief: String,
    val difficulty: String,
    val isCompleted: Boolean = false,
    val earnedReward: Int = 150,
    val simulationSnippet: String,
    val quizQuestion: String,
    val quizOptionA: String,
    val quizOptionB: String,
    val quizOptionC: String,
    val quizCorrectAnswer: String,
    val userNotes: String? = null
)

@Entity(tableName = "custom_worlds")
data class CustomWorld(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val selectedIndustry: String,
    val problemPrompt: String,
    val fullArchitectureJson: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "user_certifications")
data class UserCertification(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val courseId: String,
    val title: String,
    val earnerEmail: String,
    val dateEarned: String,
    val badgeCode: String,
    val txHash: String
)

@Entity(tableName = "user_wallet_balance")
data class UserWallet(
    @PrimaryKey val email: String,
    val rewardPoints: Int = 200, // starting balance config
    val isFounder: Boolean = false,
    val claimedGrantValue: Double = 0.0
)
