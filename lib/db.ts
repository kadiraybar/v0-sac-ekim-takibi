import { neon } from "@neondatabase/serverless"

// Veritabanı bağlantısı
const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : (() => {
      console.warn("DATABASE_URL is not defined. Using mock SQL function.")
      return async (query: string, params?: any[]) => {
        console.log("Mock SQL query:", query, params)
        return []
      }
    })()

// Veritabanı işlemleri için yardımcı fonksiyonlar
export async function getPatients() {
  try {
    const result = await sql`
      SELECT * FROM patients 
      ORDER BY created_at DESC
    `
    return result
  } catch (error) {
    console.error("Error in getPatients:", error)
    throw error
  }
}

export async function getPatientById(id: number) {
  try {
    const result = await sql`
      SELECT * FROM patients 
      WHERE id = ${id}
    `
    return result[0]
  } catch (error) {
    console.error("Error in getPatientById:", error)
    throw error
  }
}

export async function createPatient(patient: {
  first_name: string
  last_name: string
  phone: string
  email?: string
  gender?: string
}) {
  try {
    const { first_name, last_name, phone, email, gender } = patient
    const result = await sql`
      INSERT INTO patients (first_name, last_name, phone, email, gender)
      VALUES (${first_name}, ${last_name}, ${phone}, ${email}, ${gender})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error in createPatient:", error)
    throw error
  }
}

export async function updatePatient(
  id: number,
  patient: {
    first_name?: string
    last_name?: string
    phone?: string
    email?: string
    gender?: string
  },
) {
  try {
    // Dinamik güncelleme için nesne oluştur
    const updates: any = {}
    if (patient.first_name) updates.first_name = patient.first_name
    if (patient.last_name) updates.last_name = patient.last_name
    if (patient.phone) updates.phone = patient.phone
    if (patient.email !== undefined) updates.email = patient.email
    if (patient.gender !== undefined) updates.gender = patient.gender

    // Güncelleme sorgusu oluştur
    let query = "UPDATE patients SET "
    const values = []
    let i = 1

    for (const [key, value] of Object.entries(updates)) {
      query += `${key} = $${i}, `
      values.push(value)
      i++
    }

    // Son virgülü kaldır ve WHERE koşulunu ekle
    query = query.slice(0, -2) + ` WHERE id = $${i} RETURNING *`
    values.push(id)

    const result = await sql.query(query, values)
    return result.rows[0]
  } catch (error) {
    console.error("Error in updatePatient:", error)
    throw error
  }
}

export async function getDoctors() {
  try {
    const result = await sql`
      SELECT * FROM doctors 
      ORDER BY last_name
    `
    return result
  } catch (error) {
    console.error("Error in getDoctors:", error)
    throw error
  }
}

export async function getAppointmentTypes() {
  try {
    const result = await sql`
      SELECT * FROM appointment_types
    `
    return result
  } catch (error) {
    console.error("Error in getAppointmentTypes:", error)
    throw error
  }
}

export async function getAppointments(filters?: {
  status?: string
  from_date?: string
  to_date?: string
  patient_id?: number
  doctor_id?: number
}) {
  try {
    // SQL sorgusu oluştur
    let query = `
      SELECT 
        a.id, a.patient_id, a.doctor_id, a.appointment_type_id, a.date, a.duration, a.status, a.notes,
        p.first_name as patient_first_name, p.last_name as patient_last_name, p.phone as patient_phone,
        d.first_name as doctor_first_name, d.last_name as doctor_last_name,
        at.name as appointment_type_name, at.color as appointment_type_color
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN appointment_types at ON a.appointment_type_id = at.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (filters?.status) {
      query += ` AND a.status = $${paramIndex++}`
      params.push(filters.status)
    }

    if (filters?.from_date) {
      query += ` AND a.date >= $${paramIndex++}`
      params.push(new Date(filters.from_date))
    }

    if (filters?.to_date) {
      query += ` AND a.date <= $${paramIndex++}`
      params.push(new Date(filters.to_date))
    }

    if (filters?.patient_id) {
      query += ` AND a.patient_id = $${paramIndex++}`
      params.push(filters.patient_id)
    }

    if (filters?.doctor_id) {
      query += ` AND a.doctor_id = $${paramIndex++}`
      params.push(filters.doctor_id)
    }

    query += ` ORDER BY a.date`

    // Sorguyu çalıştır
    const result = await sql.query(query, params)
    return result.rows || []
  } catch (error) {
    console.error("Error in getAppointments:", error)
    throw error
  }
}

export async function getAppointmentById(id: number) {
  try {
    const query = `
      SELECT 
        a.id, a.patient_id, a.doctor_id, a.appointment_type_id, a.date, a.duration, a.status, a.notes,
        p.first_name as patient_first_name, p.last_name as patient_last_name, p.phone as patient_phone,
        d.first_name as doctor_first_name, d.last_name as doctor_last_name,
        at.name as appointment_type_name, at.color as appointment_type_color
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN appointment_types at ON a.appointment_type_id = at.id
      WHERE a.id = $1
    `

    const result = await sql.query(query, [id])
    return result.rows[0]
  } catch (error) {
    console.error("Error in getAppointmentById:", error)
    throw error
  }
}

export async function createAppointment(appointment: {
  patient_id: number
  doctor_id: number
  appointment_type_id: number
  date: Date
  duration: number
  status: string
  notes?: string
}) {
  try {
    const { patient_id, doctor_id, appointment_type_id, date, duration, status, notes } = appointment
    const result = await sql`
      INSERT INTO appointments (patient_id, doctor_id, appointment_type_id, date, duration, status, notes)
      VALUES (${patient_id}, ${doctor_id}, ${appointment_type_id}, ${date}, ${duration}, ${status}, ${notes})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error in createAppointment:", error)
    throw error
  }
}

export async function updateAppointment(
  id: number,
  appointment: {
    patient_id?: number
    doctor_id?: number
    appointment_type_id?: number
    date?: Date
    duration?: number
    status?: string
    notes?: string
  },
) {
  try {
    // Dinamik güncelleme için nesne oluştur
    const updates: any = {}
    if (appointment.patient_id) updates.patient_id = appointment.patient_id
    if (appointment.doctor_id) updates.doctor_id = appointment.doctor_id
    if (appointment.appointment_type_id) updates.appointment_type_id = appointment.appointment_type_id
    if (appointment.date) updates.date = appointment.date
    if (appointment.duration) updates.duration = appointment.duration
    if (appointment.status) updates.status = appointment.status
    if (appointment.notes !== undefined) updates.notes = appointment.notes
    updates.updated_at = new Date()

    // Güncelleme sorgusu oluştur
    let query = "UPDATE appointments SET "
    const values = []
    let i = 1

    for (const [key, value] of Object.entries(updates)) {
      query += `${key} = $${i}, `
      values.push(value)
      i++
    }

    // Son virgülü kaldır ve WHERE koşulunu ekle
    query = query.slice(0, -2) + ` WHERE id = $${i} RETURNING *`
    values.push(id)

    const result = await sql.query(query, values)
    return result.rows[0]
  } catch (error) {
    console.error("Error in updateAppointment:", error)
    throw error
  }
}

export async function getPrpTreatments(filters?: {
  from_date?: Date
  to_date?: Date
  doctor_id?: number
}) {
  try {
    let query = `
      SELECT pt.*, 
             a.date, a.status,
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name
      FROM prp_treatments pt
      JOIN appointments a ON pt.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (filters?.from_date) {
      query += ` AND a.date >= $${paramIndex++}`
      params.push(filters.from_date)
    }

    if (filters?.to_date) {
      query += ` AND a.date <= $${paramIndex++}`
      params.push(filters.to_date)
    }

    if (filters?.doctor_id) {
      query += ` AND a.doctor_id = $${paramIndex++}`
      params.push(filters.doctor_id)
    }

    query += ` ORDER BY a.date DESC`

    const result = await sql.query(query, params)
    return result.rows || []
  } catch (error) {
    console.error("Error in getPrpTreatments:", error)
    throw error
  }
}

export async function getNotifications(userId?: number, unreadOnly = false) {
  try {
    let query = `
      SELECT * FROM notifications
      WHERE (user_id IS NULL OR user_id = $1)
    `

    const params: any[] = [userId || null]

    if (unreadOnly) {
      query += ` AND is_read = false`
    }

    query += ` ORDER BY created_at DESC`

    const result = await sql.query(query, params)
    return result.rows || []
  } catch (error) {
    console.error("Error in getNotifications:", error)
    throw error
  }
}

export async function markNotificationAsRead(id: number) {
  try {
    const result = await sql`
      UPDATE notifications
      SET is_read = true
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error)
    throw error
  }
}

export async function createNotification(notification: {
  user_id?: number
  title: string
  message: string
  type: string
}) {
  try {
    const { user_id, title, message, type } = notification
    const result = await sql`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (${user_id}, ${title}, ${message}, ${type})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error in createNotification:", error)
    throw error
  }
}
