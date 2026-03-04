<?php

class CatRepository {
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
     * Get all cats sorted by created_at DESC
     * 
     * @return array Array of cat records
     * @throws PDOException on database error
     */
    public function getAllCats() {
        $query = "SELECT * FROM cats ORDER BY created_at DESC";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch cats: " . $e->getMessage());
        }
    }
    
    /**
     * Get a single cat by ID
     * 
     * @param int $id Cat ID
     * @return array|null Cat record or null if not found
     * @throws PDOException on database error
     */
    public function getCatById($id) {
        $query = "SELECT * FROM cats WHERE id = :id";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':id' => $id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch cat: " . $e->getMessage());
        }
    }
    
    /**
     * Create a new cat
     * 
     * @param array $data Cat data containing required fields
     * @return array Newly created cat record with ID
     * @throws Exception on validation or database error
     */
    public function createCat($data) {
        // Validate required fields
        $required_fields = ['cattery_id', 'name', 'gender', 'type'];
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                throw new Exception("Missing required field: $field");
            }
        }
        
        // Validate enum values
        $valid_genders = ['MALE', 'FEMALE'];
        if (!in_array($data['gender'], $valid_genders)) {
            throw new Exception("Invalid gender. Must be MALE or FEMALE");
        }
        
        $valid_types = ['ADOPTION', 'SALE'];
        if (!in_array($data['type'], $valid_types)) {
            throw new Exception("Invalid type. Must be ADOPTION or SALE");
        }
        
        // Validate price if type is SALE
        if ($data['type'] === 'SALE' && (!isset($data['price']) || $data['price'] === '')) {
            throw new Exception("Price is required for SALE type");
        }
        
        // Prepare data
        $cattery_id = (int)$data['cattery_id'];
        $name = trim($data['name']);
        $breed = isset($data['breed']) ? trim($data['breed']) : null;
        $age_months = isset($data['age_months']) ? (int)$data['age_months'] : null;
        $gender = $data['gender'];
        $color = isset($data['color']) ? trim($data['color']) : null;
        $description = isset($data['description']) ? trim($data['description']) : null;
        $type = $data['type'];
        $price = isset($data['price']) ? (float)$data['price'] : null;
        $status = isset($data['status']) ? $data['status'] : 'AVAILABLE';
        
        $query = "INSERT INTO cats 
                  (cattery_id, name, breed, age_months, gender, color, description, type, price, status)
                  VALUES 
                  (:cattery_id, :name, :breed, :age_months, :gender, :color, :description, :type, :price, :status)";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([
                ':cattery_id' => $cattery_id,
                ':name' => $name,
                ':breed' => $breed,
                ':age_months' => $age_months,
                ':gender' => $gender,
                ':color' => $color,
                ':description' => $description,
                ':type' => $type,
                ':price' => $price,
                ':status' => $status
            ]);
            
            // Get the newly created cat
            $new_cat_id = $this->pdo->lastInsertId();
            return $this->getCatById($new_cat_id);
            
        } catch (PDOException $e) {
            throw new Exception("Failed to create cat: " . $e->getMessage());
        }
    }
    
    /**
     * Update an existing cat
     * 
     * @param int $id Cat ID
     * @param array $data Cat data to update
     * @return array Updated cat record
     * @throws Exception on validation or database error
     */
    public function updateCat($id, $data) {
        // Check if cat exists
        $existing_cat = $this->getCatById($id);
        if (!$existing_cat) {
            throw new Exception("Cat with ID $id not found");
        }
        
        // Validate enum values if provided
        if (isset($data['gender'])) {
            $valid_genders = ['MALE', 'FEMALE'];
            if (!in_array($data['gender'], $valid_genders)) {
                throw new Exception("Invalid gender. Must be MALE or FEMALE");
            }
        }
        
        if (isset($data['type'])) {
            $valid_types = ['ADOPTION', 'SALE'];
            if (!in_array($data['type'], $valid_types)) {
                throw new Exception("Invalid type. Must be ADOPTION or SALE");
            }
        }
        
        if (isset($data['status'])) {
            $valid_statuses = ['AVAILABLE', 'PENDING', 'ADOPTED', 'SOLD'];
            if (!in_array($data['status'], $valid_statuses)) {
                throw new Exception("Invalid status. Must be AVAILABLE, PENDING, ADOPTED, or SOLD");
            }
        }
        
        // Validate price if type is SALE
        $type = isset($data['type']) ? $data['type'] : $existing_cat['type'];
        if ($type === 'SALE') {
            if (isset($data['price'])) {
                if ($data['price'] === '' || $data['price'] === null) {
                    throw new Exception("Price is required for SALE type");
                }
            } elseif ($existing_cat['price'] === null) {
                throw new Exception("Price is required for SALE type");
            }
        }
        
        // Build dynamic UPDATE query
        $allowed_fields = ['cattery_id', 'name', 'breed', 'age_months', 'gender', 'color', 'description', 'type', 'price', 'status'];
        $update_fields = [];
        $params = [':id' => $id];
        
        foreach ($allowed_fields as $field) {
            if (isset($data[$field])) {
                $update_fields[] = "$field = :$field";
                
                // Type casting
                if ($field === 'cattery_id' || $field === 'age_months') {
                    $params[":$field"] = (int)$data[$field];
                } elseif ($field === 'price') {
                    $params[":$field"] = $data[$field] !== null ? (float)$data[$field] : null;
                } else {
                    $params[":$field"] = trim($data[$field]);
                }
            }
        }
        
        // If no fields to update, return existing cat
        if (empty($update_fields)) {
            return $existing_cat;
        }
        
        $query = "UPDATE cats SET " . implode(", ", $update_fields) . " WHERE id = :id";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute($params);
            
            // Get the updated cat
            return $this->getCatById($id);
            
        } catch (PDOException $e) {
            throw new Exception("Failed to update cat: " . $e->getMessage());
        }
    }
    
    /**
     * Delete a cat by ID
     * 
     * @param int $id Cat ID to delete
     * @return bool True if deleted, false if not found
     * @throws Exception on database error
     */
    public function deleteCat($id) {
        // Check if cat exists
        $existing_cat = $this->getCatById($id);
        if (!$existing_cat) {
            throw new Exception("Cat with ID $id not found");
        }
        
        $query = "DELETE FROM cats WHERE id = :id";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':id' => $id]);
            
            return $stmt->rowCount() > 0;
            
        } catch (PDOException $e) {
            throw new Exception("Failed to delete cat: " . $e->getMessage());
        }
    }
}
?>
