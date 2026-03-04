<?php

class ImageRepository {
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
     * Upload image for a cat
     * 
     * @param int $cat_id Cat ID
     * @param string $image_url Image URL/path
     * @return array Image record
     * @throws Exception on database error
     */
    public function uploadImage($cat_id, $image_url) {
        // Check if cat exists
        if (!$this->catExists($cat_id)) {
            throw new Exception("Cat with ID $cat_id not found");
        }
        
        $query = "INSERT INTO cat_images (cat_id, image_url)
                  VALUES (:cat_id, :image_url)";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([
                ':cat_id' => $cat_id,
                ':image_url' => $image_url
            ]);
            
            // Get the newly created image record
            $image_id = $this->pdo->lastInsertId();
            return $this->getImageById($image_id);
            
        } catch (PDOException $e) {
            throw new Exception("Failed to upload image: " . $e->getMessage());
        }
    }
    
    /**
     * Get image by ID
     * 
     * @param int $id Image ID
     * @return array|null Image record or null if not found
     * @throws Exception on database error
     */
    public function getImageById($id) {
        $query = "SELECT * FROM cat_images WHERE id = :id";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':id' => $id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch image: " . $e->getMessage());
        }
    }
    
    /**
     * Get all images for a cat
     * 
     * @param int $cat_id Cat ID
     * @return array Array of image records
     * @throws Exception on database error
     */
    public function getImagesByCat($cat_id) {
        $query = "SELECT * FROM cat_images WHERE cat_id = :cat_id ORDER BY created_at DESC";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':cat_id' => $cat_id]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch images: " . $e->getMessage());
        }
    }
    
    /**
     * Delete image by ID
     * 
     * @param int $id Image ID
     * @return bool True if deleted, false if not found
     * @throws Exception on database error
     */
    public function deleteImage($id) {
        $query = "DELETE FROM cat_images WHERE id = :id";
        
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':id' => $id]);
            
            return $stmt->rowCount() > 0;
            
        } catch (PDOException $e) {
            throw new Exception("Failed to delete image: " . $e->getMessage());
        }
    }
}
?>
