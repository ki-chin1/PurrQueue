<?php

class ApplicationRepository {
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
     * Check if cat exists
     * 
     * @param int $cat_id Cat ID
     * @return bool True if cat exists, false otherwise
     * @throws Exception on database error
     */
    public function catExists($cat_id) {
        $query = "SELECT id FROM cats WHERE id = :cat_id LIMIT 1";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':cat_id' => $cat_id]);
            return $stmt->fetch() !== false;
        } catch (PDOException $e) {
            throw new Exception("Failed to check cat: " . $e->getMessage());
        }
    }
    
    /**
     * Check if user exists
     * 
     * @param int $user_id User ID
     * @return bool True if user exists, false otherwise
     * @throws Exception on database error
     */
    public function userExists($user_id) {
        $query = "SELECT id FROM users WHERE id = :user_id LIMIT 1";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':user_id' => $user_id]);
            return $stmt->fetch() !== false;
        } catch (PDOException $e) {
            throw new Exception("Failed to check user: " . $e->getMessage());
        }
    }
    
    /**
     * Check if user already applied for this cat
     * 
     * @param int $cat_id Cat ID
     * @param int $user_id User ID
     * @return bool True if already applied, false otherwise
     * @throws Exception on database error
     */
    public function userAlreadyApplied($cat_id, $user_id) {
        $query = "SELECT id FROM applications WHERE cat_id = :cat_id AND user_id = :user_id LIMIT 1";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':cat_id' => $cat_id, ':user_id' => $user_id]);
            return $stmt->fetch() !== false;
        } catch (PDOException $e) {
            throw new Exception("Failed to check application: " . $e->getMessage());
        }
    }
    
    /**
     * Create a new application (apply for a cat)
     * 
     * @param array $data Application data
     * @return array Newly created application record
     * @throws Exception on validation or database error
     */
    public function createApplication($data) {
        // Validate required fields
        if (!isset($data['cat_id']) || (int)$data['cat_id'] === 0) {
            throw new Exception("Cat ID is required");
        }
        
        if (!isset($data['user_id']) || (int)$data['user_id'] === 0) {
            throw new Exception("User ID is required");
        }
        
        $cat_id = (int)$data['cat_id'];
        $user_id = (int)$data['user_id'];
        
        // Check if cat exists
        if (!$this->catExists($cat_id)) {
            throw new Exception("Cat with ID $cat_id not found");
        }
        
        // Check if user exists
        if (!$this->userExists($user_id)) {
            throw new Exception("User with ID $user_id not found");
        }
        
        // Check if user already applied for this cat (unique constraint)
        if ($this->userAlreadyApplied($cat_id, $user_id)) {
            throw new Exception("You have already applied for this cat");
        }
        
        // Prepare optional data
        $application_message = isset($data['application_message']) ? trim($data['application_message']) : null;
        $monthly_income = isset($data['monthly_income']) ? (int)$data['monthly_income'] : null;
        $current_cats_count = isset($data['current_cats_count']) ? (int)$data['current_cats_count'] : 0;
        $has_dog = isset($data['has_dog']) ? (bool)$data['has_dog'] : false;
        $housing_type = isset($data['housing_type']) ? $data['housing_type'] : null;
        $house_size_sqm = isset($data['house_size_sqm']) ? (int)$data['house_size_sqm'] : null;
        $has_children = isset($data['has_children']) ? (bool)$data['has_children'] : false;
        $experience_with_cats = isset($data['experience_with_cats']) ? trim($data['experience_with_cats']) : null;
        
        // Validate housing_type if provided
        if ($housing_type) {
            $valid_housing = ['RENT', 'OWN'];
            if (!in_array($housing_type, $valid_housing)) {
                throw new Exception("Invalid housing_type. Must be RENT or OWN");
            }
        }
        
        $query = "INSERT INTO applications 
                  (cat_id, user_id, application_message, monthly_income, current_cats_count, 
                   has_dog, housing_type, house_size_sqm, has_children, experience_with_cats)
                  VALUES 
                  (:cat_id, :user_id, :application_message, :monthly_income, :current_cats_count, 
                   :has_dog, :housing_type, :house_size_sqm, :has_children, :experience_with_cats)";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([
                ':cat_id' => $cat_id,
                ':user_id' => $user_id,
                ':application_message' => $application_message,
                ':monthly_income' => $monthly_income,
                ':current_cats_count' => $current_cats_count,
                ':has_dog' => $has_dog ? 1 : 0,
                ':housing_type' => $housing_type,
                ':house_size_sqm' => $house_size_sqm,
                ':has_children' => $has_children ? 1 : 0,
                ':experience_with_cats' => $experience_with_cats
            ]);
            
            // Get the newly created application
            $new_app_id = $this->pdo->lastInsertId();
            return $this->getApplicationById($new_app_id);
            
        } catch (PDOException $e) {
            throw new Exception("Failed to create application: " . $e->getMessage());
        }
    }
    
    /**
     * Get application by ID
     * 
     * @param int $id Application ID
     * @return array|null Application record or null if not found
     * @throws Exception on database error
     */
    public function getApplicationById($id) {
        $query = "SELECT * FROM applications WHERE id = :id";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':id' => $id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch application: " . $e->getMessage());
        }
    }
    
    /**
     * Get application by ID and verify it belongs to user
     * 
     * @param int $id Application ID
     * @param int $user_id User ID
     * @return array|null Application record or null if not found or doesn't belong to user
     * @throws Exception on database error
     */
    public function getMyApplication($id, $user_id) {
        $query = "SELECT * FROM applications WHERE id = :id AND user_id = :user_id";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':id' => $id, ':user_id' => $user_id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch application: " . $e->getMessage());
        }
    }
    
    /**
     * Get all applications by user ID
     * 
     * @param int $user_id User ID
     * @return array Array of applications
     * @throws Exception on database error
     */
    public function getApplicationsByUser($user_id) {
        $query = "SELECT * FROM applications WHERE user_id = :user_id ORDER BY applied_at DESC";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':user_id' => $user_id]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch applications: " . $e->getMessage());
        }
    }
    
    /**
     * Get all applications for a cat
     * 
     * @param int $cat_id Cat ID
     * @return array Array of applications
     * @throws Exception on database error
     */
    public function getApplicationsByCat($cat_id) {
        $query = "SELECT * FROM applications WHERE cat_id = :cat_id ORDER BY applied_at DESC";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':cat_id' => $cat_id]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch applications: " . $e->getMessage());
        }
    }
}
?>
