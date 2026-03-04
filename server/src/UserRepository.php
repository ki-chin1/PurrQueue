<?php

class UserRepository {
    private $pdo;
    
    /**
     * Constructor
     * 
     * @param PDO $pdo Database connection
     */
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    
    /**
     * Get user by ID
     * 
     * @param int $id User ID
     * @return array|null User record or null if not found
     * @throws Exception on database error
     */
    public function getUserById($id) {
        $query = "SELECT id, name, email, phone, address, role, created_at, updated_at FROM users WHERE id = :id";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':id' => $id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch user: " . $e->getMessage());
        }
    }
    
    /**
     * Get all users
     * 
     * @return array Array of user records
     * @throws Exception on database error
     */
    public function getAllUsers() {
        $query = "SELECT id, name, email, phone, address, role, created_at, updated_at FROM users ORDER BY created_at DESC";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch users: " . $e->getMessage());
        }
    }
    
    /**
     * Get user by email
     * 
     * @param string $email User email
     * @return array|null User record or null if not found
     * @throws Exception on database error
     */
    public function getUserByEmail($email) {
        $query = "SELECT id, name, email, phone, address, role, created_at, updated_at FROM users WHERE email = :email";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':email' => $email]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch user: " . $e->getMessage());
        }
    }
    
    /**
     * Check if email already exists
     * 
     * @param string $email Email to check
     * @return bool True if email exists, false otherwise
     * @throws Exception on database error
     */
    public function emailExists($email) {
        $query = "SELECT id FROM users WHERE email = :email LIMIT 1";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':email' => $email]);
            return $stmt->fetch() !== false;
        } catch (PDOException $e) {
            throw new Exception("Failed to check email: " . $e->getMessage());
        }
    }
    
    /**
     * Create a new user (signup)
     * 
     * @param array $data User data
     * @return array Newly created user record (without password)
     * @throws Exception on validation or database error
     */
    public function signup($data) {
        // Validate required fields
        $required_fields = ['name', 'email', 'password'];
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                throw new Exception("Missing required field: $field");
            }
        }
        
        // Validate email format
        $email = trim($data['email']);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format");
        }
        
        // Check if email already exists
        if ($this->emailExists($email)) {
            throw new Exception("Email already registered");
        }
        
        // Validate password
        $password = $data['password'];
        if (strlen($password) < 6) {
            throw new Exception("Password must be at least 6 characters");
        }
        
        // Hash password
        $password_hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
        
        // Prepare data
        $name = trim($data['name']);
        $phone = isset($data['phone']) ? trim($data['phone']) : null;
        $address = isset($data['address']) ? trim($data['address']) : null;
        $role = isset($data['role']) ? $data['role'] : 'USER';
        
        // Validate role
        $valid_roles = ['USER', 'ADMIN', 'CATTERY_ADMIN'];
        if (!in_array($role, $valid_roles)) {
            throw new Exception("Invalid role. Must be USER, ADMIN, or CATTERY_ADMIN");
        }
        
        $query = "INSERT INTO users (name, email, password, phone, address, role)
                  VALUES (:name, :email, :password, :phone, :address, :role)";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':password' => $password_hash,
                ':phone' => $phone,
                ':address' => $address,
                ':role' => $role
            ]);
            
            // Get the newly created user (without password)
            $new_user_id = $this->pdo->lastInsertId();
            return $this->getUserById($new_user_id);
            
        } catch (PDOException $e) {
            // Check for unique constraint violation
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                throw new Exception("Email already registered");
            }
            throw new Exception("Failed to create user: " . $e->getMessage());
        }
    }
    
    /**
     * User login
     * 
     * @param string $email User email
     * @param string $password User password
     * @return array User record if credentials are valid (without password)
     * @throws Exception if email not found or password incorrect
     */
    public function login($email, $password) {
        // Validate inputs
        if (!isset($email) || trim($email) === '') {
            throw new Exception("Email is required");
        }
        
        if (!isset($password) || trim($password) === '') {
            throw new Exception("Password is required");
        }
        
        // Normalize email
        $email = trim($email);
        
        // Get user by email with password hash
        $query = "SELECT id, name, email, password, phone, address, role, created_at, updated_at FROM users WHERE email = :email";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch();
            
            // Check if user exists
            if (!$user) {
                throw new Exception("Invalid email or password");
            }
            
            // Verify password
            if (!password_verify($password, $user['password'])) {
                throw new Exception("Invalid email or password");
            }
            
            // Return user data without password
            unset($user['password']);
            return $user;
            
        } catch (PDOException $e) {
            throw new Exception("Failed to login: " . $e->getMessage());
        }
    }
    
    /**
     * Update an existing user
     * 
     * @param int $id User ID
     * @param array $data User data to update
     * @return array Updated user record (without password)
     * @throws Exception on validation or database error
     */
    public function updateUser($id, $data) {
        // Check if user exists
        $existing_user = $this->getUserById($id);
        if (!$existing_user) {
            throw new Exception("User with ID $id not found");
        }
        
        // Build dynamic UPDATE query
        $allowed_fields = ['name', 'email', 'phone', 'address', 'role'];
        $update_fields = [];
        $params = [':id' => $id];
        
        // Validate email if provided
        if (isset($data['email'])) {
            $new_email = trim($data['email']);
            
            // Check if new email is different from existing
            if ($new_email !== $existing_user['email']) {
                // Validate email format
                if (!filter_var($new_email, FILTER_VALIDATE_EMAIL)) {
                    throw new Exception("Invalid email format");
                }
                
                // Check if new email already exists
                if ($this->emailExists($new_email)) {
                    throw new Exception("Email already registered");
                }
            }
        }
        
        // Validate role if provided
        if (isset($data['role'])) {
            $valid_roles = ['USER', 'ADMIN', 'CATTERY_ADMIN'];
            if (!in_array($data['role'], $valid_roles)) {
                throw new Exception("Invalid role. Must be USER, ADMIN, or CATTERY_ADMIN");
            }
        }
        
        // Process each allowed field
        foreach ($allowed_fields as $field) {
            if (isset($data[$field])) {
                $update_fields[] = "$field = :$field";
                $params[":$field"] = trim($data[$field]);
            }
        }
        
        // If no fields to update, return existing user
        if (empty($update_fields)) {
            return $existing_user;
        }
        
        $query = "UPDATE users SET " . implode(", ", $update_fields) . " WHERE id = :id";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute($params);
            
            // Get the updated user (without password)
            return $this->getUserById($id);
            
        } catch (PDOException $e) {
            // Check for unique constraint violation
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                throw new Exception("Email already registered");
            }
            throw new Exception("Failed to update user: " . $e->getMessage());
        }
    }
}
?>