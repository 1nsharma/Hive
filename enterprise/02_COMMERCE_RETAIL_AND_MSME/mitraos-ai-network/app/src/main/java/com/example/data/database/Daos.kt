package com.example.data.database

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface SwarajDao {
    @Query("SELECT * FROM training_courses")
    fun getAllCourses(): Flow<List<TrainingCourse>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCourses(courses: List<TrainingCourse>)

    @Query("UPDATE training_courses SET isCompleted = :isCompleted WHERE id = :courseId")
    suspend fun updateCourseCompletion(courseId: String, isCompleted: Boolean)

    @Query("UPDATE training_courses SET userNotes = :notes WHERE id = :courseId")
    suspend fun updateCourseNotes(courseId: String, notes: String)

    @Query("SELECT * FROM custom_worlds ORDER BY timestamp DESC")
    fun getAllWorlds(): Flow<List<CustomWorld>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCustomWorld(world: CustomWorld)

    @Query("SELECT * FROM user_certifications")
    fun getAllCertifications(): Flow<List<UserCertification>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCertification(certificate: UserCertification)

    @Query("SELECT * FROM user_wallet_balance WHERE email = :email LIMIT 1")
    suspend fun getWallet(email: String): UserWallet?

    @Query("SELECT * FROM user_wallet_balance WHERE email = :email LIMIT 1")
    fun observeWallet(email: String): Flow<UserWallet?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateWallet(wallet: UserWallet)
}
