package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"sync"
	"time"
	"math/rand"
	"bytes"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/tealeg/xlsx"
	_ "github.com/lib/pq"
)

type User struct {
	Id        int    `json:"id"`
	FirstName string `json:"firstname"`
	Email     string `json:"email"`
	LastName  string `json:"lastname"`
	Password  string `json:"password"`
	Role	  string `json:"role"`
}

type Node struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
}

type Device struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	Type       int    `json:"type"`
	Apikey     string `json:"apikey"`
	PauseState bool   `json:"pausestate"`
	NodeID *int `json:"node_id"`
}

type DataEngrow struct {
	Id          int       `json:"id"`
	Apikey      string    `json:"apikey"`
	Temperature float64   `json:"temperature"`
	Humidity    float64   `json:"humidity"`
	CO2         float64   `json:"co2"`
	VPD         float64   `json:"vpd"`
	Created_at  time.Time `json:"created_at"`
	Month 		int		  `json:"month"`
}

type DataTest struct {
	Id          int       `json:"id"`
	Apikey      string    `json:"apikey"`
	Temperature float64   `json:"temperature"`
	Humidity    float64   `json:"humidity"`
	CO2         float64   `json:"co2"`
	VPD         float64   `json:"vpd"`
	Created_at  time.Time `json:"created_at"`
	Month 		int		  `json:"month"`
}

type DataNutrigrow struct {
	Id          int       `json:"id"`
	Apikey      string    `json:"apikey"`
	Temperature float64   `json:"temperature"`
	PH          float64   `json:"ph"`
	EC          float64   `json:"ec"`
	DO          float64   `json:"do"`
	Created_at  time.Time `json:"created_at"`
	Month 		int		  `json:"month"`
}

type DataAWS struct {
	Id            int       `json:"id"`
	Apikey        string    `json:"apikey"`
	Temperature   float64   `json:"temperature"`
	Humidity      float64   `json:"humidity"`
	AirPressure   float64   `json:"airpressure"`
	Windspeed     float64   `json:"windspeed"`
	Winddirection float64   `json:"winddirection"`
	Created_at    time.Time `json:"created_at"`
	Month 		  int		`json:"month"`
}

var (
	clients   = make(map[string]*websocket.Conn) // Map to store websocket connections
	clientsMu sync.Mutex                         // Mutex to safely access clients map
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// main function
func main() {
	loc, err := time.LoadLocation("Asia/Jakarta")
	if err != nil {
		// Handle error
		panic(err)
	}
	now := time.Now().In(loc)
	fmt.Println("Waktu di Jakarta:", now)
	//connect to database
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// create table if not exists
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, firstname TEXT, email TEXT, lastname TEXT, password TEXT, role TEXT)")
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS devices (id SERIAL PRIMARY KEY, name TEXT, type INTEGER, apikey TEXT, pausestate BOOLEAN)")
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS node (id SERIAL PRIMARY KEY, name TEXT)")
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS dataengrows (id SERIAL PRIMARY KEY, apikey TEXT, temperature NUMERIC(10, 2), humidity NUMERIC(10, 2), co2 NUMERIC(10, 2), vpd NUMERIC(10, 2), created_at TIMESTAMP)")
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS datatest (id SERIAL PRIMARY KEY, apikey TEXT, temperature NUMERIC(10, 2), humidity NUMERIC(10, 2), co2 NUMERIC(10, 2), vpd NUMERIC(10, 2), created_at TIMESTAMP)")
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS datanutrigrows (
		id SERIAL PRIMARY KEY,
		apikey TEXT,
		temperature NUMERIC(10, 2),
		ph NUMERIC(10, 2),
		ec NUMERIC(10, 2),
		"do" NUMERIC(10, 2),
		created_at TIMESTAMP
	)`)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS dataaws (id SERIAL PRIMARY KEY, apikey TEXT, temperature NUMERIC(10, 2), humidity NUMERIC(10, 2), airpressure NUMERIC(10, 2), windspeed NUMERIC(10, 2), winddirection NUMERIC(10, 2), created_at TIMESTAMP)")
	if err != nil {
		log.Fatal(err)
	}

	// create router
	router := mux.NewRouter()

	//USER
	router.HandleFunc("/api/go/users", getUsers(db)).Methods("GET")
	router.HandleFunc("/api/go/users", createUser(db)).Methods("POST")
	router.HandleFunc("/api/go/users/{id}", getUser(db)).Methods("GET")
	router.HandleFunc("/api/go/users/{id}", updateUser(db)).Methods("PUT")
	router.HandleFunc("/api/go/users/{id}", deleteUser(db)).Methods("DELETE")
	router.HandleFunc("/api/go/search/users", searchUsers(db)).Methods("GET")

	//DEVICE
	router.HandleFunc("/api/go/devices", getDevices(db)).Methods("GET")
	router.HandleFunc("/api/go/devices", createDevice(db)).Methods("POST")
	router.HandleFunc("/api/go/devices/{id}", getDevice(db)).Methods("GET")
	router.HandleFunc("/api/go/devices/{id}", updateDevices(db)).Methods("PUT")
	router.HandleFunc("/api/go/devices/{id}", deleteDevices(db)).Methods("DELETE")
	router.HandleFunc("/api/go/search/devices", searchDevices(db)).Methods("GET")

	router.HandleFunc("/api/go/nodes", getNodes(db)).Methods("GET")
	router.HandleFunc("/api/go/nodes", createNode(db)).Methods("POST")
	router.HandleFunc("/api/go/nodes/{id}", getNode(db)).Methods("GET")
	router.HandleFunc("/api/go/nodes/{id}", updateNode(db)).Methods("PUT")
	router.HandleFunc("/api/go/nodes/{id}", deleteNode(db)).Methods("DELETE")
	// router.HandleFunc("/api/go/search/nodes", searchNodes(db)).Methods("GET")

	//DATAENGROW
	router.HandleFunc("/api/go/dataengrow/{apikey}", getDataEngrow(db)).Methods("GET")
	router.HandleFunc("/api/go/saveengrow", saveEngrow(db)).Methods("GET")
	router.HandleFunc("/api/go/dataengrows/last10/{apikey}", getLast10DataEngrow(db)).Methods("GET")

	//DATANUTRIGROW
	router.HandleFunc("/api/go/datanutrigrow/{apikey}", getDataNutrigrow(db)).Methods("GET")
	router.HandleFunc("/api/go/savenutrigrow", saveNutrigrow(db)).Methods("GET")
	router.HandleFunc("/api/go/nutrigrows/last10/{apikey}", getLast10Nutrigrow(db)).Methods("GET")

	//DATAAWS
	router.HandleFunc("/api/go/dataaws/{apikey}", getDataAWS(db)).Methods("GET")
	router.HandleFunc("/api/go/savedataaws", saveDataAWS(db)).Methods("GET")
	router.HandleFunc("/api/go/dataaws/last10/{apikey}", getLast10DataAWS(db)).Methods("GET")

	router.HandleFunc("/api/go/datatest/{apikey}", getDataTest(db)).Methods("GET")

	router.HandleFunc("/api/go/randomseed", randomSeed(db)).Methods("GET")

	router.HandleFunc("/api/go/availabledevice", getAvailableDevices(db)).Methods("GET")

	//EXPORT
	router.HandleFunc("/api/go/export/{apikey}", exportData(db)).Methods("GET")
	router.HandleFunc("/api/go/exportdevices", exportDevices(db)).Methods("GET")
	router.HandleFunc("/api/go/exportusers", exportUsers(db)).Methods("GET")

	//CHART
	router.HandleFunc("/api/go/chartengrow", getChartEngrow(db)).Methods("GET")
	router.HandleFunc("/api/go/chartnutrigrow", getChartNutrigrow(db)).Methods("GET")
	router.HandleFunc("/api/go/chartaws", getChartAWS(db)).Methods("GET")

	// Go Routine check status
	go checkDevices(db)

	router.HandleFunc("/ws", handleWebSocket)

	// wrap the router with CORS and JSON content type middlewares
	enhancedRouter := enableCORS(jsonContentTypeMiddleware(router))

	// // Nama sequence yang ingin diubah
	// sequenceName := "public.devices_id_seq"

	// // Nilai baru yang ingin diatur untuk sequence
	// newValue := 7

	// // Query untuk mengubah sequence
	// query := fmt.Sprintf("ALTER SEQUENCE %s RESTART WITH %d", sequenceName, newValue)

	// _, err = db.Exec(query)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// fmt.Printf("Nilai terakhir dari sequence '%s' telah diatur ulang menjadi %d\n", sequenceName, newValue)

	// // var sequenceName string
    // err = db.QueryRow("SELECT pg_get_serial_sequence('devices', 'id')").Scan(&sequenceName)
    // if err != nil {
    //     log.Fatal(err)
    // }

    // fmt.Println("Nama sequence untuk kolom 'id' di tabel 'devices':", sequenceName)

	// var lastValue int
    // err = db.QueryRow("SELECT last_value FROM public.devices_id_seq").Scan(&lastValue)
    // if err != nil {
    //     log.Fatal(err)
    // }

    // fmt.Println("Nilai terakhir dari sequence 'public.devices_id_seq':", lastValue)


	// start server
	log.Fatal(http.ListenAndServe(":8000", enhancedRouter))

	select {}
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	// Mutex lock to safely access clients map
	clientsMu.Lock()
	clients[conn.RemoteAddr().String()] = conn
	clientsMu.Unlock()

	// Remove connection from clients map when connection is closed
	defer func() {
		clientsMu.Lock()
		delete(clients, conn.RemoteAddr().String())
		clientsMu.Unlock()
	}()

	// Infinite loop to send current time to client every second
	for {
		message := []byte(time.Now().Format(time.RFC3339))
		if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
			log.Println(err)
			break
		}
		time.Sleep(10000 * time.Second)
	}
}

// Function to broadcast message to all connected clients
func broadcastToClients(apikey string) {
	clientsMu.Lock()
	defer clientsMu.Unlock()

	// Prepare the message to send (you can customize this based on your needs)
	message := []byte(apikey)
	log.Println("Broadcasting apikey:", apikey)

	// Iterate over connected clients and send the message
	for _, conn := range clients {
		if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
			log.Println("Error broadcasting message:", err)
		}
	}
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allow any origin
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Disposition")

		// Check if the request is for CORS preflight
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Pass down the request to the next middleware (or final handler)
		next.ServeHTTP(w, r)
	})

}

func jsonContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set JSON Content-Type
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func randomSeed(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		rand.Seed(time.Now().UnixNano())

		stmt, err := db.Prepare("INSERT INTO datatest(apikey, temperature, humidity, co2, vpd, created_at) VALUES($1, $2, $3, $4, $5, $6)")
		if err != nil {
			log.Fatal(err)
		}
		defer stmt.Close()

		numRecords := 51840  // Jumlah data yang ingin dimasukkan
		recordsPerMonth := numRecords / 12  // 12 bulan dalam setahun
		apikey:= "engrow2"

		for month := 1; month <= 12; month++ {
			monthName := time.Month(month).String()  // Nama bulan dalam teks (Januari, Februari, dst.)
			fmt.Printf("Inserting records for %s\n", monthName)

			for i := 0; i < recordsPerMonth; i++ {
				// Generate data seperti sebelumnya
				temperature := rand.Intn(1000) + 1
				humidity := rand.Intn(1000) + 1
				co2 := rand.Intn(1000) + 1
				vpd := rand.Intn(1000) + 1
				created_at := time.Date(2024, time.Month(month), rand.Intn(28)+1, rand.Intn(24), rand.Intn(60), rand.Intn(60), 0, time.UTC)

				// Eksekusi pernyataan persiapan SQL
				_, err = stmt.Exec(apikey, temperature, humidity, co2, vpd, created_at)
				if err != nil {
					log.Fatal(err)
				}

				// Cetak kemajuan setiap 10,000 data
				if i > 0 && i%10000 == 0 {
					fmt.Printf("%d records inserted for %s\n", i, monthName)
				}
			}

			fmt.Printf("Finished inserting %d records for %s\n", recordsPerMonth, monthName)
		}

	}
}

func getAvailableDevices(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, name, apikey, type FROM devices WHERE node_id IS NULL ORDER BY id")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var devices []Device
		for rows.Next() {
			var device Device
			if err := rows.Scan(&device.Id, &device.Name, &device.Apikey, &device.Type); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			devices = append(devices, device)
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(devices); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}

func checkDevices(db *sql.DB) {
	for {
		checkAndPauseDevices(db)
		time.Sleep(1 * time.Minute)
	}
}

func checkAndPauseDevices(db *sql.DB) {
	const checkInterval = 10 * time.Minute

	// Query to get all devices
	deviceQuery := `
		SELECT id, type, apikey
		FROM devices
	`

	rows, err := db.Query(deviceQuery)
	if err != nil {
		log.Printf("Failed to retrieve devices: %v\n", err)
		return
	}
	defer rows.Close()

	// Iterate over all devices
	for rows.Next() {
		var deviceID int
		var deviceType int
		var apikey string
		if err := rows.Scan(&deviceID, &deviceType, &apikey); err != nil {
			log.Printf("Failed to scan device row: %v\n", err)
			continue
		}

		// Determine the appropriate query based on device type
		var dataQuery string
		switch deviceType {
		case 0:
			dataQuery = `
				SELECT 1
				FROM dataengrows
				WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '10 minutes'
			`
		case 1:
			dataQuery = `
				SELECT 1
				FROM datanutrigrows
				WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '10 minutes'
			`
		case 2:
			dataQuery = `
				SELECT 1
				FROM dataaws
				WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '10 minutes'
			`
		default:
			log.Printf("Unknown device type %d for device ID %d\n", deviceType, deviceID)
			continue
		}

		// Execute the data query
		var exists int
		err := db.QueryRow(dataQuery, apikey).Scan(&exists)
		if err == sql.ErrNoRows {
			// No recent data found, update the device pausestate to true (paused)
			updateQuery := `
				UPDATE devices
				SET pausestate = true
				WHERE id = $1
			`
			_, err = db.Exec(updateQuery, deviceID)
			if err != nil {
				log.Printf("Failed to update device pausestate for device ID %d: %v\n", deviceID, err)
			} else {
				log.Printf("Device ID %d pausestate updated to true\n", deviceID)
			}
		} else if err != nil {
			log.Printf("Failed to check data for device ID %d: %v\n", deviceID, err)
		} else {
			// If recent data is found, ensure pausestate is false (active)
			updateQuery := `
				UPDATE devices
				SET pausestate = false
				WHERE id = $1
			`
			_, err = db.Exec(updateQuery, deviceID)
			if err != nil {
				log.Printf("Failed to update device pausestate for device ID %d: %v\n", deviceID, err)
			}
		}
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating over device rows: %v\n", err)
	}
}



// USER //

// get all users
func getUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, firstname, email, lastname, role FROM users")
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		users := []User{} // array of users
		for rows.Next() {
			var u User
			if err := rows.Scan(&u.Id, &u.FirstName, &u.Email, &u.LastName, &u.Role); err != nil {
				log.Fatal(err)
			}
			users = append(users, u)
		}
		if err := rows.Err(); err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(users)
	}
}

// get user by id
func getUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		var u User
		err := db.QueryRow("SELECT id, firstname, email, lastname, role FROM users WHERE id = $1", id).Scan(&u.Id, &u.FirstName, &u.Email, &u.LastName, &u.Role)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(u)
	}
}

// create user
func createUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u User
		json.NewDecoder(r.Body).Decode(&u)

		err := db.QueryRow("INSERT INTO users (firstname, email, lastname, role) VALUES ($1, $2, $3, $4) RETURNING id", u.FirstName, u.Email, u.LastName, u.Role).Scan(&u.Id)
		if err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(u)
	}
}

// update user
func updateUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u User
		json.NewDecoder(r.Body).Decode(&u)

		vars := mux.Vars(r)
		id := vars["id"]

		// Execute the update query
		_, err := db.Exec("UPDATE users SET firstname = $1, email = $2, lastname = $3, role = $4 WHERE id = $4", u.FirstName, u.Email, u.LastName, u.Role, id)
		if err != nil {
			log.Fatal(err)
		}

		// Retrieve the updated user data from the database
		var updatedUser User
		err = db.QueryRow("SELECT id, firstname, email, lastname, role FROM users WHERE id = $1", id).Scan(&updatedUser.Id, &updatedUser.FirstName, &updatedUser.Email, &updatedUser.LastName, &updatedUser.Role)
		if err != nil {
			log.Fatal(err)
		}

		// Send the updated user data in the response
		json.NewEncoder(w).Encode(updatedUser)
	}
}

// delete user
func deleteUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		var u User
		err := db.QueryRow("SELECT id, firstname, email, lastname, role FROM users WHERE id = $1", id).Scan(&u.Id, &u.FirstName, &u.Email, &u.LastName, &u.Role)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		} else {
			_, err := db.Exec("DELETE FROM users WHERE id = $1", id)
			if err != nil {
				//todo : fix error handling
				w.WriteHeader(http.StatusNotFound)
				return
			}

			json.NewEncoder(w).Encode("User deleted")
		}
	}
}

func searchUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query().Get("q")

		rows, err := db.Query(
			"SELECT id, firstname, email, lastname, role FROM users WHERE firstname ILIKE $1 OR lastname ILIKE $1 OR email ILIKE $1",
			"%"+query+"%",
		)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		users := []User{}
		for rows.Next() {
			var u User
			if err := rows.Scan(&u.Id, &u.FirstName, &u.Email, &u.LastName, &u.Role); err != nil {
				log.Fatal(err)
			}
			users = append(users, u)
		}
		if err := rows.Err(); err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(users)
	}
}


// DEVICE //

// get all devices
func getDevices(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, name, type, apikey, pausestate FROM devices ORDER BY id")
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		devices := []Device{} // array of devices
		for rows.Next() {
			var u Device
			if err := rows.Scan(&u.Id, &u.Name, &u.Type, &u.Apikey, &u.PauseState); err != nil {
				log.Fatal(err)
			}
			devices = append(devices, u)
		}
		if err := rows.Err(); err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(devices)
	}
}

// get device by id
func getDevice(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		var u Device
		err := db.QueryRow("SELECT id, name, type, apikey, pausestate FROM devices WHERE id = $1", id).Scan(&u.Id, &u.Name, &u.Type, &u.Apikey, &u.PauseState)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(u)
	}
}

// create device
func createDevice(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u Device
		json.NewDecoder(r.Body).Decode(&u)

		err := db.QueryRow("INSERT INTO devices (name, type, apikey, pausestate) VALUES ($1, $2, $3, $4) RETURNING id", u.Name, u.Type, u.Apikey, u.PauseState).Scan(&u.Id)
		if err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(u)
	}
}

// update device
func updateDevices(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u Device
		json.NewDecoder(r.Body).Decode(&u)

		vars := mux.Vars(r)
		id := vars["id"]

		// Execute the update query
		_, err := db.Exec("UPDATE devices SET name = $1, type = $2, apikey = $3 WHERE id = $4", u.Name, u.Type, u.Apikey, id)
		if err != nil {
			log.Fatal(err)
		}

		// Retrieve the updated device data from the database
		var updatedDevice Device
		err = db.QueryRow("SELECT id, name, type, apikey FROM devices WHERE id = $1", id).Scan(&updatedDevice.Id, &updatedDevice.Name, &updatedDevice.Type, &updatedDevice.Apikey)
		if err != nil {
			log.Fatal(err)
		}

		// Send the updated device data in the response
		json.NewEncoder(w).Encode(updatedDevice)
	}
}

// delete device
func deleteDevices(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		var u Device
		err := db.QueryRow("SELECT id, name, type, apikey FROM devices WHERE id = $1", id).Scan(&u.Id, &u.Name, &u.Type, &u.Apikey)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		} else {
			_, err := db.Exec("DELETE FROM devices WHERE id = $1", id)
			if err != nil {
				//todo : fix error handling
				w.WriteHeader(http.StatusNotFound)
				return
			}

			json.NewEncoder(w).Encode("Device deleted")
		}
	}
}

// search device
func searchDevices(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query().Get("q")

		rows, err := db.Query(
			"SELECT id, name, type, apikey FROM devices WHERE name ILIKE $1 OR apikey ILIKE $1",
			"%"+query+"%",
		)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		devices := []Device{}
		for rows.Next() {
			var u Device
			if err := rows.Scan(&u.Id, &u.Name, &u.Type, &u.Apikey); err != nil {
				log.Fatal(err)
			}
			devices = append(devices, u)
		}
		if err := rows.Err(); err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(devices)
	}
}


// NODE //

// get all nodes
func getNodes(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, name FROM node ORDER BY id")
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		nodes := []Node{} // array of Nodes
		for rows.Next() {
			var u Node
			if err := rows.Scan(&u.Id, &u.Name); err != nil {
				log.Fatal(err)
			}
			nodes = append(nodes, u)
		}
		if err := rows.Err(); err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(nodes)
	}
}

//get salah satu node
func getNode(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		nodeID, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid node ID", http.StatusBadRequest)
			return
		}

		type Devicez struct {
			ID int `json:"id"`
			Name string `json:"name"`
			Apikey string `json:"apikey"`
		}

		type NodeWithDevices struct {
			ID      int      `json:"id"`
			Name    string   `json:"name"`
			Devices []Devicez `json:"devices"`
		}

		node := NodeWithDevices{}

		// Query to get the node information
		queryNode := `SELECT id, name FROM node WHERE id = $1`
		row := db.QueryRow(queryNode, nodeID)
		if err := row.Scan(&node.ID, &node.Name); err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Node not found", http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Query to get the devices associated with the node
		queryDevices := `SELECT id, name, apikey FROM devices WHERE node_id = $1`
		rows, err := db.Query(queryDevices, nodeID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		for rows.Next() {
			device := Devicez{}
			if err := rows.Scan(&device.ID, &device.Name, &device.Apikey); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			node.Devices = append(node.Devices, device)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(node)
	}
}


func createNode(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type Request struct {
			Name    string `json:"name"`
			Devices []int  `json:"devices"`
		}

		var req Request
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		tx, err := db.Begin()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var nodeID int
		err = tx.QueryRow("INSERT INTO node (name) VALUES ($1) RETURNING id", req.Name).Scan(&nodeID)
		if err != nil {
			tx.Rollback()
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		for _, deviceID := range req.Devices {
			_, err = tx.Exec("UPDATE devices SET node_id = $1 WHERE id = $2", nodeID, deviceID)
			if err != nil {
				tx.Rollback()
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		if err := tx.Commit(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}

func deleteNode(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		nodeID, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid node ID", http.StatusBadRequest)
			return
		}

		tx, err := db.Begin()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		_, err = tx.Exec("UPDATE devices SET node_id = NULL WHERE node_id = $1", nodeID)
		if err != nil {
			tx.Rollback()
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		_, err = tx.Exec("DELETE FROM node WHERE id = $1", nodeID)
		if err != nil {
			tx.Rollback()
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := tx.Commit(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

// update node
func updateNode(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		nodeID, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid node ID", http.StatusBadRequest)
			return
		}

		type NodeWithDevices struct {
			ID      int      `json:"id"`
			Name    string   `json:"name"`
			Devices []Device `json:"devices"`
		}

		var node NodeWithDevices
		err = json.NewDecoder(r.Body).Decode(&node)
		if err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		tx, err := db.Begin()
		if err != nil {
			log.Printf("Failed to start transaction: %v", err)
			http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
			return
		}

		_, err = tx.Exec("UPDATE node SET name = $1 WHERE id = $2", node.Name, nodeID)
		if err != nil {
			log.Printf("Failed to update node: %v", err)
			tx.Rollback()
			http.Error(w, "Failed to update node", http.StatusInternalServerError)
			return
		}

		_, err = tx.Exec("UPDATE devices SET node_id = NULL WHERE node_id = $1", nodeID)
		if err != nil {
			log.Printf("Failed to clear existing devices: %v", err)
			tx.Rollback()
			http.Error(w, "Failed to clear existing devices", http.StatusInternalServerError)
			return
		}

		for _, device := range node.Devices {
			_, err := tx.Exec("UPDATE devices SET node_id = $1 WHERE id = $2", nodeID, device.Id)
			if err != nil {
				log.Printf("Failed to update device %d: %v", device.Id, err)
				tx.Rollback()
				http.Error(w, "Failed to update devices", http.StatusInternalServerError)
				return
			}
		}

		err = tx.Commit()
		if err != nil {
			log.Printf("Failed to commit transaction: %v", err)
			http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}





// ENGROW //

// get dataengrow by apikey with min, max, and avg values (rounded to 2 decimal places)
func getDataEngrow(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		loc, err := time.LoadLocation("Asia/Jakarta")
		if err != nil {
			// Handle error loading location
			panic(err)
		}
		today := time.Now().In(loc).Format("2006-01-02")

		vars := mux.Vars(r)
		apikey := vars["apikey"]

		var latest DataEngrow
		err = db.QueryRow(`
			SELECT id, apikey, ROUND(temperature::numeric, 2), ROUND(humidity::numeric, 2), ROUND(co2::numeric, 2), ROUND(vpd::numeric, 2), created_at 
			FROM dataengrows 
			WHERE apikey = $1 
			ORDER BY created_at DESC 
			LIMIT 1`, apikey).Scan(&latest.Id, &latest.Apikey, &latest.Temperature, &latest.Humidity, &latest.CO2, &latest.VPD, &latest.Created_at)
		
		if err != nil {
			if err == sql.ErrNoRows {
				// Jika tidak ada data latest, langsung kembalikan response dengan status 404
				w.WriteHeader(http.StatusNotFound)
				json.NewEncoder(w).Encode(struct {
					Status string `json:"status"`
				}{
					Status: "error",
				})
				return
			} else {
				// Jika terjadi kesalahan lain, set status 500 dan kirim response error
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(struct {
					Status string `json:"status"`
				}{
					Status: "error",
				})
				return
			}
		}

		// Jika data latest ditemukan, lanjutkan untuk mengambil data min, max, avg
		var min, max, avg DataEngrow
		err = db.QueryRow(`
			SELECT 
				ROUND(MIN(temperature)::numeric, 2) AS min_temperature,
				ROUND(MAX(temperature)::numeric, 2) AS max_temperature,
				ROUND(AVG(temperature)::numeric, 2) AS avg_temperature,
				ROUND(MIN(humidity)::numeric, 2) AS min_humidity,
				ROUND(MAX(humidity)::numeric, 2) AS max_humidity,
				ROUND(AVG(humidity)::numeric, 2) AS avg_humidity,
				ROUND(MIN(co2)::numeric, 2) AS min_co2,
				ROUND(MAX(co2)::numeric, 2) AS max_co2,
				ROUND(AVG(co2)::numeric, 2) AS avg_co2,
				ROUND(MIN(vpd)::numeric, 2) AS min_vpd,
				ROUND(MAX(vpd)::numeric, 2) AS max_vpd,
				ROUND(AVG(vpd)::numeric, 2) AS avg_vpd
			FROM dataengrows
			WHERE apikey = $1 AND DATE(created_at) = $2`, apikey, today).Scan(
				&min.Temperature, &max.Temperature, &avg.Temperature,
				&min.Humidity, &max.Humidity, &avg.Humidity,
				&min.CO2, &max.CO2, &avg.CO2,
				&min.VPD, &max.VPD, &avg.VPD)

		if err != nil {
			// Jika tidak ada data min, max, avg, kirim response tanpa data ini
			w.WriteHeader(http.StatusOK)
			response := struct {
				Status string     `json:"status"`
				Latest DataEngrow `json:"latest"`
			}{
				Status: "success",
				Latest: latest,
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		}

		// Jika kedua query berhasil, set status 200 dan kirim response dengan semua data
		w.WriteHeader(http.StatusOK)
		response := struct {
			Status string     `json:"status"`
			Latest DataEngrow `json:"latest"`
			Min    DataEngrow `json:"min"`
			Max    DataEngrow `json:"max"`
			Avg    DataEngrow `json:"avg"`
		}{
			Status: "success",
			Latest: latest,
			Min:    min,
			Max:    max,
			Avg:    avg,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

// Menyimpan data Engrow ke database
func saveEngrow(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		loc, err := time.LoadLocation("Asia/Jakarta")
		if err != nil {
			// Handle error
			panic(err)
		}
		// Mengambil nilai dari query parameter
		apikey := r.URL.Query().Get("apikey")
		temperature := r.URL.Query().Get("temperature")
		humidity := r.URL.Query().Get("humidity")
		co2 := r.URL.Query().Get("co2")
		vpd := r.URL.Query().Get("vpd")

		// Validasi parameter yang diperlukan tidak boleh kosong
		if apikey == "" || temperature == "" || humidity == "" || co2 == "" || vpd == "" {
			http.Error(w, "Semua parameter harus diisi", http.StatusBadRequest)
			return
		}

		var deviceExists bool
		err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM devices WHERE apikey = $1)`, apikey).Scan(&deviceExists)
		if err != nil {
			http.Error(w, "Gagal memeriksa apikey", http.StatusInternalServerError)
			return
		}

		if !deviceExists {
			http.Error(w, "Apikey tidak valid", http.StatusUnauthorized)
			return
		}

		// Konversi parameter ke tipe data yang sesuai
		temp, err := strconv.ParseFloat(temperature, 64)
		if err != nil {
			http.Error(w, "Parameter temperature harus berupa angka", http.StatusBadRequest)
			return
		}
		humid, err := strconv.ParseFloat(humidity, 64)
		if err != nil {
			http.Error(w, "Parameter humidity harus berupa angka", http.StatusBadRequest)
			return
		}
		co2Level, err := strconv.ParseFloat(co2, 64)
		if err != nil {
			http.Error(w, "Parameter co2 harus berupa angka", http.StatusBadRequest)
			return
		}
		vpdValue, err := strconv.ParseFloat(vpd, 64)
		if err != nil {
			http.Error(w, "Parameter vpd harus berupa angka", http.StatusBadRequest)
			return
		}

		// Membuat variabel untuk menyimpan data baru
		var id int
		err = db.QueryRow("INSERT INTO dataengrows (apikey, temperature, humidity, co2, vpd, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
			apikey, temp, humid, co2Level, vpdValue, time.Now().In(loc)).Scan(&id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Membuat objek DataEngrow untuk dikirim sebagai response
		u := DataEngrow{
			Id:          id,
			Apikey:      apikey,
			Temperature: temp,
			Humidity:    humid,
			CO2:         co2Level,
			VPD:         vpdValue,
			Created_at:  time.Now().In(loc),
		}

		// Mengembalikan response dengan status code 200 (OK)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(u)

		broadcastToClients(apikey)
	}
}

// get last 10 dataengrow entries by apikey
func getLast10DataEngrow(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		apikey := vars["apikey"]

		rows, err := db.Query("SELECT * FROM dataengrows WHERE apikey = $1 ORDER BY created_at DESC LIMIT 10", apikey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		dataEngrows := []DataEngrow{}

		for rows.Next() {
			var data DataEngrow
			if err := rows.Scan(&data.Id, &data.Apikey, &data.Temperature, &data.Humidity, &data.CO2, &data.VPD, &data.Created_at); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			dataEngrows = append(dataEngrows, data)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Sort from oldest to newest
		sort.Slice(dataEngrows, func(i, j int) bool {
			return dataEngrows[i].Created_at.Before(dataEngrows[j].Created_at)
		})

		json.NewEncoder(w).Encode(dataEngrows)
	}
}


// get last 10 dataengrow entries by apikey
func getDataTest(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		apikey := vars["apikey"]

		rows, err := db.Query("SELECT * FROM datatest WHERE apikey = $1 ORDER BY created_at DESC LIMIT 100000", apikey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		dataTests := []DataTest{}

		for rows.Next() {
			var data DataTest
			if err := rows.Scan(&data.Id, &data.Apikey, &data.Temperature, &data.Humidity, &data.CO2, &data.VPD, &data.Created_at); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			dataTests = append(dataTests, data)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Sort from oldest to newest
		sort.Slice(dataTests, func(i, j int) bool {
			return dataTests[i].Created_at.Before(dataTests[j].Created_at)
		})

		json.NewEncoder(w).Encode(dataTests)
	}
}




// NUTRIGROW //

// get datanutrigrow by apikey with min, max, and avg values (rounded to 2 decimal places)
func getDataNutrigrow(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		loc, err := time.LoadLocation("Asia/Jakarta")
		if err != nil {
			// Handle error
			panic(err)
		}
		today := time.Now().In(loc).Format("2006-01-02")

		vars := mux.Vars(r)
		apikey := vars["apikey"]

		var latest DataNutrigrow
		err = db.QueryRow(`
			SELECT id, apikey, ROUND(temperature::numeric, 2), ROUND(ph::numeric, 2), ROUND(ec::numeric, 2), ROUND("do"::numeric, 2), created_at 
			FROM datanutrigrows 
			WHERE apikey = $1 
			ORDER BY created_at DESC 
			LIMIT 1`, apikey).Scan(&latest.Id, &latest.Apikey, &latest.Temperature, &latest.PH, &latest.EC, &latest.DO, &latest.Created_at)
		if err != nil {
			if err == sql.ErrNoRows {
				// Jika tidak ada data latest, langsung kembalikan response dengan status 404
				w.WriteHeader(http.StatusNotFound)
				json.NewEncoder(w).Encode(struct {
					Status string `json:"status"`
				}{
					Status: "error",
				})
				return
			} else {
				// Jika terjadi kesalahan lain, set status 500 dan kirim response error
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(struct {
					Status string `json:"status"`
				}{
					Status: "error",
				})
				return
			}
		}

		var min, max, avg DataNutrigrow
		err = db.QueryRow(`
			SELECT 
				ROUND(MIN(temperature)::numeric, 2) AS min_temperature,
				ROUND(MAX(temperature)::numeric, 2) AS max_temperature,
				ROUND(AVG(temperature)::numeric, 2) AS avg_temperature,
				ROUND(MIN(ph)::numeric, 2) AS min_ph,
				ROUND(MAX(ph)::numeric, 2) AS max_ph,
				ROUND(AVG(ph)::numeric, 2) AS avg_ph,
				ROUND(MIN(ec)::numeric, 2) AS min_ec,
				ROUND(MAX(ec)::numeric, 2) AS max_ec,
				ROUND(AVG(ec)::numeric, 2) AS avg_ec,
				ROUND(MIN("do")::numeric, 2) AS min_do,
				ROUND(MAX("do")::numeric, 2) AS max_do,
				ROUND(AVG("do")::numeric, 2) AS avg_do
			FROM datanutrigrows
			WHERE apikey = $1 AND DATE(created_at) = $2`, apikey, today).Scan(
			&min.Temperature, &max.Temperature, &avg.Temperature,
			&min.PH, &max.PH, &avg.PH,
			&min.EC, &max.EC, &avg.EC,
			&min.DO, &max.DO, &avg.DO)
		if err != nil {
			// Jika tidak ada data min, max, avg, kirim response tanpa data ini
			w.WriteHeader(http.StatusOK)
			response := struct {
				Status string     `json:"status"`
				Latest DataNutrigrow `json:"latest"`
			}{
				Status: "success",
				Latest: latest,
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		}

		w.WriteHeader(http.StatusOK)
		response := struct {
			Status string     `json:"status"`
			Latest DataNutrigrow `json:"latest"`
			Min    DataNutrigrow `json:"min"`
			Max    DataNutrigrow `json:"max"`
			Avg    DataNutrigrow `json:"avg"`
		}{
			Status: "success",
			Latest: latest,
			Min:    min,
			Max:    max,
			Avg:    avg,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

// Menyimpan data Engrow ke database
func saveNutrigrow(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		loc, err := time.LoadLocation("Asia/Jakarta")
		if err != nil {
			// Handle error
			panic(err)
		}
		// Mengambil nilai dari query parameter
		apikey := r.URL.Query().Get("apikey")
		temperature := r.URL.Query().Get("temperature")
		ph := r.URL.Query().Get("ph")
		ec := r.URL.Query().Get("ec")
		do := r.URL.Query().Get("do")

		// Validasi parameter yang diperlukan tidak boleh kosong
		if apikey == "" || temperature == "" || ph == "" || ec == "" || do == "" {
			http.Error(w, "Semua parameter harus diisi", http.StatusBadRequest)
			return
		}

		var deviceExists bool
		err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM devices WHERE apikey = $1)`, apikey).Scan(&deviceExists)
		if err != nil {
			http.Error(w, "Gagal memeriksa apikey", http.StatusInternalServerError)
			return
		}

		if !deviceExists {
			http.Error(w, "Apikey tidak valid", http.StatusUnauthorized)
			return
		}

		// Konversi parameter ke tipe data yang sesuai
		temp, err := strconv.ParseFloat(temperature, 64)
		if err != nil {
			http.Error(w, "Parameter temperature harus berupa angka", http.StatusBadRequest)
			return
		}
		phLevel, err := strconv.ParseFloat(ph, 64)
		if err != nil {
			http.Error(w, "Parameter ph harus berupa angka", http.StatusBadRequest)
			return
		}
		ecLevel, err := strconv.ParseFloat(ec, 64)
		if err != nil {
			http.Error(w, "Parameter ec harus berupa angka", http.StatusBadRequest)
			return
		}
		doValue, err := strconv.ParseFloat(do, 64)
		if err != nil {
			http.Error(w, "Parameter do harus berupa angka", http.StatusBadRequest)
			return
		}

		// Membuat variabel untuk menyimpan data baru
		var id int
		err = db.QueryRow(`INSERT INTO datanutrigrows (apikey, temperature, ph, ec, "do", created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
			apikey, temp, phLevel, ecLevel, doValue, time.Now().In(loc)).Scan(&id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Membuat objek DataEngrow untuk dikirim sebagai response
		u := DataNutrigrow{
			Id:          id,
			Apikey:      apikey,
			Temperature: temp,
			PH:          phLevel,
			EC:          ecLevel,
			DO:          doValue,
			Created_at:  time.Now().In(loc),
		}

		// Mengembalikan response dengan status code 200 (OK)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(u)

		broadcastToClients(apikey)
	}
}

// get last 10 nutrigrow entries by apikey
func getLast10Nutrigrow(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		apikey := vars["apikey"]

		rows, err := db.Query("SELECT * FROM datanutrigrows WHERE apikey = $1 ORDER BY created_at DESC LIMIT 10", apikey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		nutrigrows := []DataNutrigrow{}

		for rows.Next() {
			var data DataNutrigrow
			if err := rows.Scan(&data.Id, &data.Apikey, &data.Temperature, &data.PH, &data.EC, &data.DO, &data.Created_at); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			nutrigrows = append(nutrigrows, data)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Sort from oldest to newest
		sort.Slice(nutrigrows, func(i, j int) bool {
			return nutrigrows[i].Created_at.Before(nutrigrows[j].Created_at)
		})

		json.NewEncoder(w).Encode(nutrigrows)
	}
}



// AWS //

// get dataengrow by apikey with min, max, and avg values (rounded to 2 decimal places)
func getDataAWS(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		loc, err := time.LoadLocation("Asia/Jakarta")
		if err != nil {
			// Handle error
			panic(err)
		}
		today := time.Now().In(loc).Format("2006-01-02")

		vars := mux.Vars(r)
		apikey := vars["apikey"]

		var latest DataAWS
		err = db.QueryRow(`
			SELECT id, apikey, ROUND(temperature::numeric, 2), ROUND(humidity::numeric, 2), ROUND(airpressure::numeric, 2), ROUND(windspeed::numeric, 2), ROUND(winddirection::numeric, 2), created_at 
			FROM dataaws 
			WHERE apikey = $1 
			ORDER BY created_at DESC 
			LIMIT 1`, apikey).Scan(&latest.Id, &latest.Apikey, &latest.Temperature, &latest.Humidity, &latest.AirPressure, &latest.Windspeed, &latest.Winddirection, &latest.Created_at)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		var min, max, avg DataAWS
		err = db.QueryRow(`
			SELECT 
				ROUND(MIN(temperature)::numeric, 2) AS min_temperature,
				ROUND(MAX(temperature)::numeric, 2) AS max_temperature,
				ROUND(AVG(temperature)::numeric, 2) AS avg_temperature,
				ROUND(MIN(humidity)::numeric, 2) AS min_humidity,
				ROUND(MAX(humidity)::numeric, 2) AS max_humidity,
				ROUND(AVG(humidity)::numeric, 2) AS avg_humidity,
				ROUND(MIN(airpressure)::numeric, 2) AS min_airpressure,
				ROUND(MAX(airpressure)::numeric, 2) AS max_airpressure,
				ROUND(AVG(airpressure)::numeric, 2) AS avg_airpressure,
				ROUND(MIN(windspeed)::numeric, 2) AS min_windspeed,
				ROUND(MAX(windspeed)::numeric, 2) AS max_windspeed,
				ROUND(AVG(windspeed)::numeric, 2) AS avg_windspeed,
				ROUND(MIN(winddirection)::numeric, 2) AS min_winddirection,
				ROUND(MAX(winddirection)::numeric, 2) AS max_winddirection,
				ROUND(AVG(winddirection)::numeric, 2) AS avg_winddirection
			FROM dataaws
			WHERE apikey = $1 AND DATE(created_at) = $2`, apikey, today).Scan(
			&min.Temperature, &max.Temperature, &avg.Temperature,
			&min.Humidity, &max.Humidity, &avg.Humidity,
			&min.AirPressure, &max.AirPressure, &avg.AirPressure,
			&min.Windspeed, &max.Windspeed, &avg.Windspeed,
			&min.Winddirection, &max.Winddirection, &avg.Winddirection)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			// return
		}

		response := struct {
			Latest DataAWS `json:"latest"`
			Min    DataAWS `json:"min"`
			Max    DataAWS `json:"max"`
			Avg    DataAWS `json:"avg"`
		}{
			Latest: latest,
			Min:    min,
			Max:    max,
			Avg:    avg,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

// Menyimpan data Engrow ke database
func saveDataAWS(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		loc, err := time.LoadLocation("Asia/Jakarta")
		if err != nil {
			// Handle error
			panic(err)
		}
		// Mengambil nilai dari query parameter
		apikey := r.URL.Query().Get("apikey")
		temperature := r.URL.Query().Get("temperature")
		humidity := r.URL.Query().Get("humidity")
		airpressure := r.URL.Query().Get("airpressure")
		windspeed := r.URL.Query().Get("windspeed")
		winddirection := r.URL.Query().Get("winddirection")

		// Validasi parameter yang diperlukan tidak boleh kosong
		if apikey == "" || temperature == "" || humidity == "" || airpressure == "" || windspeed == "" || winddirection == "" {
			http.Error(w, "Semua parameter harus diisi", http.StatusBadRequest)
			return
		}

		var deviceExists bool
		err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM devices WHERE apikey = $1)`, apikey).Scan(&deviceExists)
		if err != nil {
			http.Error(w, "Gagal memeriksa apikey", http.StatusInternalServerError)
			return
		}

		if !deviceExists {
			http.Error(w, "Apikey tidak valid", http.StatusUnauthorized)
			return
		}

		// Konversi parameter ke tipe data yang sesuai
		temp, err := strconv.ParseFloat(temperature, 64)
		if err != nil {
			http.Error(w, "Parameter temperature harus berupa angka", http.StatusBadRequest)
			return
		}
		humid, err := strconv.ParseFloat(humidity, 64)
		if err != nil {
			http.Error(w, "Parameter humidity harus berupa angka", http.StatusBadRequest)
			return
		}
		airpressureLevel, err := strconv.ParseFloat(airpressure, 64)
		if err != nil {
			http.Error(w, "Parameter air pressure harus berupa angka", http.StatusBadRequest)
			return
		}
		windspeedValue, err := strconv.ParseFloat(windspeed, 64)
		if err != nil {
			http.Error(w, "Parameter windspeed harus berupa angka", http.StatusBadRequest)
			return
		}
		winddirectionValue, err := strconv.ParseFloat(winddirection, 64)
		if err != nil {
			http.Error(w, "Parameter winddirection harus berupa angka", http.StatusBadRequest)
			return
		}

		// Membuat variabel untuk menyimpan data baru
		var id int
		err = db.QueryRow("INSERT INTO dataaws (apikey, temperature, humidity, airpressure, windspeed, winddirection, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
			apikey, temp, humid, airpressureLevel, windspeedValue, winddirectionValue, time.Now().In(loc)).Scan(&id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Membuat objek DataEngrow untuk dikirim sebagai response
		u := DataAWS{
			Id:            id,
			Apikey:        apikey,
			Temperature:   temp,
			Humidity:      humid,
			AirPressure:   airpressureLevel,
			Windspeed:     windspeedValue,
			Winddirection: winddirectionValue,
			Created_at:    time.Now().In(loc),
		}

		// Mengembalikan response dengan status code 200 (OK)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(u)

		broadcastToClients(apikey)
	}
}

// get last 10 aws entries by apikey
func getLast10DataAWS(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		apikey := vars["apikey"]

		rows, err := db.Query("SELECT * FROM dataaws WHERE apikey = $1 ORDER BY created_at DESC LIMIT 10", apikey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		aws := []DataAWS{}

		for rows.Next() {
			var data DataAWS
			if err := rows.Scan(&data.Id, &data.Apikey, &data.Temperature, &data.Humidity, &data.AirPressure, &data.Windspeed, &data.Winddirection, &data.Created_at); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			aws = append(aws, data)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Sort from oldest to newest
		sort.Slice(aws, func(i, j int) bool {
			return aws[i].Created_at.Before(aws[j].Created_at)
		})

		json.NewEncoder(w).Encode(aws)
	}
}



// EXPORT //
func exportData(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        apikey := vars["apikey"]

        query := `
            SELECT temperature, humidity, co2, vpd
            FROM datatest
            WHERE apikey = $1
        `

        fmt.Printf("Exporting data for apikey: %s\n", apikey)

        file := xlsx.NewFile()
        sheet, err := file.AddSheet("Data")
        if err != nil {
            http.Error(w, "Failed to create sheet", http.StatusInternalServerError)
            return
        }

        // Menulis header
        header := sheet.AddRow()
        header.AddCell().SetValue("Temperature")
        header.AddCell().SetValue("Humidity")
        header.AddCell().SetValue("CO2")
        header.AddCell().SetValue("VPD")

        // Streaming rows dari database ke file XLSX
        rows, err := db.Query(query, apikey)
        if err != nil {
            http.Error(w, "Failed to query database", http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        for rows.Next() {
            var temperature, humidity, co2, vpd float64
            if err := rows.Scan(&temperature, &humidity, &co2, &vpd); err != nil {
                http.Error(w, "Failed to scan row", http.StatusInternalServerError)
                return
            }

            row := sheet.AddRow()
            row.AddCell().SetFloat(temperature)
            row.AddCell().SetFloat(humidity)
            row.AddCell().SetFloat(co2)
            row.AddCell().SetFloat(vpd)
        }

        // Simpan file ke buffer
        var buffer bytes.Buffer
        err = file.Write(&buffer)
        if err != nil {
            http.Error(w, "Failed to write file", http.StatusInternalServerError)
            return
        }

        // Mengirim file ke klien
        w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        w.Header().Set("Content-Disposition", "attachment; filename=exported_data.xlsx")
        w.WriteHeader(http.StatusOK)
        buffer.WriteTo(w)
    }
}

// export devices
func exportDevices(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // apikey := vars["apikey"]

        query := `
            SELECT id, name, type, apikey
            FROM devices ORDER BY id
        `

        file := xlsx.NewFile()
        sheet, err := file.AddSheet("Data Device")
        if err != nil {
            http.Error(w, "Failed to create sheet", http.StatusInternalServerError)
            return
        }

        // Menulis header
        header := sheet.AddRow()
        header.AddCell().SetValue("Id")
        header.AddCell().SetValue("Name")
        header.AddCell().SetValue("Type")
        header.AddCell().SetValue("Apikey")

        // Streaming rows dari database ke file XLSX
        rows, err := db.Query(query)
        if err != nil {
            http.Error(w, "Failed to query database", http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        for rows.Next() {
            var id int
            var name, apikey string
            var typeValue int
            if err := rows.Scan(&id, &name, &typeValue, &apikey); err != nil {
                http.Error(w, "Failed to scan row", http.StatusInternalServerError)
                return
            }

            var typeStr string
            switch typeValue {
            case 0:
                typeStr = "Engrow"
            case 1:
                typeStr = "Nutrigrow"
            case 2:
                typeStr = "AWS"
            default:
                typeStr = "Unknown"
            }

            row := sheet.AddRow()
            row.AddCell().SetValue(id)
            row.AddCell().SetValue(name)
            row.AddCell().SetValue(typeStr)
            row.AddCell().SetValue(apikey)
        }

        // Simpan file ke buffer
        var buffer bytes.Buffer
        err = file.Write(&buffer)
        if err != nil {
            http.Error(w, "Failed to write file", http.StatusInternalServerError)
            return
        }

        // Mengirim file ke klien
        w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        w.Header().Set("Content-Disposition", "attachment; filename=allDevices.xlsx")
        w.WriteHeader(http.StatusOK)
        buffer.WriteTo(w)
    }
}

// export devices
func exportUsers(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // apikey := vars["apikey"]

        query := `
            SELECT id, firstname, lastname, email, role
            FROM users ORDER BY id
        `

        file := xlsx.NewFile()
        sheet, err := file.AddSheet("Data User")
        if err != nil {
            http.Error(w, "Failed to create sheet", http.StatusInternalServerError)
            return
        }

        // Menulis header
        header := sheet.AddRow()
        header.AddCell().SetValue("Id")
        header.AddCell().SetValue("Firstname")
        header.AddCell().SetValue("Lastname")
        header.AddCell().SetValue("Email")
		header.AddCell().SetValue("Role")

        // Streaming rows dari database ke file XLSX
        rows, err := db.Query(query)
        if err != nil {
            http.Error(w, "Failed to query database", http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        for rows.Next() {
            var id int
            var firstname, lastname, email, role string
            if err := rows.Scan(&id, &firstname, &lastname, &email, &role); err != nil {
                http.Error(w, "Failed to scan row", http.StatusInternalServerError)
                return
            }

            row := sheet.AddRow()
            row.AddCell().SetValue(id)
            row.AddCell().SetValue(firstname)
            row.AddCell().SetValue(lastname)
            row.AddCell().SetValue(email)
			row.AddCell().SetValue(role)
        }

        // Simpan file ke buffer
        var buffer bytes.Buffer
        err = file.Write(&buffer)
        if err != nil {
            http.Error(w, "Failed to write file", http.StatusInternalServerError)
            return
        }

        // Mengirim file ke klien
        w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        w.Header().Set("Content-Disposition", "attachment; filename=allUsers.xlsx")
        w.WriteHeader(http.StatusOK)
        buffer.WriteTo(w)
    }
}


// CHART //

// Chart Engrow
func getChartEngrow(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        apikey := r.URL.Query().Get("apikey")
        timeFilter := r.URL.Query().Get("timeFilter")

        var query string
        switch timeFilter {
        case "24H":
            query = "SELECT id, apikey, temperature, humidity, co2, vpd, created_at FROM dataengrows WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '24 hours' ORDER BY created_at ASC"
        case "1W":
            query = "SELECT id, apikey, temperature, humidity, co2, vpd, created_at FROM dataengrows WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '1 week' ORDER BY created_at ASC"
        case "1M":
            query = "SELECT id, apikey, temperature, humidity, co2, vpd, created_at FROM dataengrows WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '1 month' ORDER BY created_at ASC"
        case "1Y":
            query = `
                SELECT 
                    id, apikey, temperature, humidity, co2, vpd, created_at,
                    EXTRACT(MONTH FROM created_at) as month
                FROM dataengrows 
                WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '1 year'
                ORDER BY created_at ASC`
        default:
            http.Error(w, "Invalid time filter", http.StatusBadRequest)
            return
        }

        rows, err := db.Query(query, apikey)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        var data []DataEngrow
        for rows.Next() {
            var d DataEngrow
            var month int
            if timeFilter == "1Y" {
                if err := rows.Scan(&d.Id, &d.Apikey, &d.Temperature, &d.Humidity, &d.CO2, &d.VPD, &d.Created_at, &month); err != nil {
                    http.Error(w, err.Error(), http.StatusInternalServerError)
                    return
                }
                d.Month = month
            } else {
                if err := rows.Scan(&d.Id, &d.Apikey, &d.Temperature, &d.Humidity, &d.CO2, &d.VPD, &d.Created_at); err != nil {
                    http.Error(w, err.Error(), http.StatusInternalServerError)
                    return
                }
            }

			d.Created_at = d.Created_at.Local()
            d.Created_at = d.Created_at.Truncate(1 * time.Second)
            data = append(data, d)
        }

        if timeFilter == "1Y" {
            // Group data by month
            groupedData := make(map[int][]DataEngrow)
            for _, d := range data {
                groupedData[d.Month] = append(groupedData[d.Month], d)
            }
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(groupedData)
        } else {
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(data)
        }
    }
}

// Chart Nutrigrow
func getChartNutrigrow(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        apikey := r.URL.Query().Get("apikey")
        timeFilter := r.URL.Query().Get("timeFilter")

        var query string
        switch timeFilter {
        case "24H":
            query = `SELECT id, apikey, temperature, ph, ec, "do", created_at FROM datanutrigrows WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '24 hours' ORDER BY created_at ASC`
        case "1W":
            query = `SELECT id, apikey, temperature, ph, ec, "do", created_at FROM datanutrigrows WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '1 week' ORDER BY created_at ASC`
        case "1M":
            query = `SELECT id, apikey, temperature, ph, ec, "do", created_at FROM datanutrigrows WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '1 month' ORDER BY created_at ASC`
        case "1Y":
            query = `
                SELECT 
                    id, apikey, temperature, ph, ec, "do", created_at,
                    EXTRACT(MONTH FROM created_at) as month
                FROM datanutrigrows 
                WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '1 year'
                ORDER BY created_at ASC`
        default:
            http.Error(w, "Invalid time filter", http.StatusBadRequest)
            return
        }

        rows, err := db.Query(query, apikey)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        var data []DataNutrigrow
        for rows.Next() {
            var d DataNutrigrow
            var month int
            if timeFilter == "1Y" {
                if err := rows.Scan(&d.Id, &d.Apikey, &d.Temperature, &d.PH, &d.EC, &d.DO, &d.Created_at, &month); err != nil {
                    http.Error(w, err.Error(), http.StatusInternalServerError)
                    return
                }
                d.Month = month
            } else {
                if err := rows.Scan(&d.Id, &d.Apikey, &d.Temperature, &d.PH, &d.EC, &d.DO, &d.Created_at); err != nil {
                    http.Error(w, err.Error(), http.StatusInternalServerError)
                    return
                }
            }

			d.Created_at = d.Created_at.Local()
            d.Created_at = d.Created_at.Truncate(1 * time.Second)
            data = append(data, d)
        }

        if timeFilter == "1Y" {
            // Group data by month
            groupedData := make(map[int][]DataNutrigrow)
            for _, d := range data {
                groupedData[d.Month] = append(groupedData[d.Month], d)
            }
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(groupedData)
        } else {
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(data)
        }
    }
}

// Chart AWS
func getChartAWS(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        apikey := r.URL.Query().Get("apikey")
        timeFilter := r.URL.Query().Get("timeFilter")

        var query string
        switch timeFilter {
        case "24H":
            query = "SELECT id, apikey, temperature, humidity, airpressure, windspeed, winddirection, created_at FROM dataaws WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '24 hours' ORDER BY created_at ASC"
        case "1W":
            query = "SELECT id, apikey, temperature, humidity, airpressure, windspeed, winddirection, created_at FROM dataaws WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '1 week' ORDER BY created_at ASC"
        case "1M":
            query = "SELECT id, apikey, temperature, humidity, airpressure, windspeed, winddirection, created_at FROM dataaws WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '1 month' ORDER BY created_at ASC"
        case "1Y":
            query = `
                SELECT 
                    id, apikey, temperature, humidity, airpressure, windspeed, winddirection, created_at,
                    EXTRACT(MONTH FROM created_at) as month
                FROM dataaws 
                WHERE apikey = $1 AND created_at >= NOW() - INTERVAL '1 year'
                ORDER BY created_at ASC`
        default:
            http.Error(w, "Invalid time filter", http.StatusBadRequest)
            return
        }

        rows, err := db.Query(query, apikey)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        var data []DataAWS
        for rows.Next() {
            var d DataAWS
            var month int
            if timeFilter == "1Y" {
                if err := rows.Scan(&d.Id, &d.Apikey, &d.Temperature, &d.Humidity, &d.AirPressure, &d.Windspeed, &d.Winddirection, &d.Created_at, &month); err != nil {
                    http.Error(w, err.Error(), http.StatusInternalServerError)
                    return
                }
                d.Month = month
            } else {
                if err := rows.Scan(&d.Id, &d.Apikey, &d.Temperature, &d.Humidity, &d.AirPressure, &d.Windspeed, &d.Winddirection, &d.Created_at); err != nil {
                    http.Error(w, err.Error(), http.StatusInternalServerError)
                    return
                }
            }

			d.Created_at = d.Created_at.Local()
            d.Created_at = d.Created_at.Truncate(1 * time.Second)
            data = append(data, d)
        }

        if timeFilter == "1Y" {
            // Group data by month
            groupedData := make(map[int][]DataAWS)
            for _, d := range data {
                groupedData[d.Month] = append(groupedData[d.Month], d)
            }
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(groupedData)
        } else {
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(data)
        }
    }
}





