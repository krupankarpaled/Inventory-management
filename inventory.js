
// Water Bottle Inventory Management System
class InventorySystem {
    constructor() {
      this.inventory = [];
      this.initializeEventListeners();
      this.loadInventory();
    }
  
    // Load inventory from localStorage if available
    loadInventory() {
      const savedInventory = localStorage.getItem('waterBottleInventory');
      if (savedInventory) {
        this.inventory = JSON.parse(savedInventory);
        this.displayInventory();
      }
    }
  
    // Save inventory to localStorage
    saveInventory() {
      localStorage.setItem('waterBottleInventory', JSON.stringify(this.inventory));
    }
  
    // Add a new water bottle to inventory
    addItem(name, quantity, price) {
      // Validate inputs
      if (!name || !quantity || !price) {
        alert('All fields are required');
        return false;
      }
  
      if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
        alert('Quantity and price must be positive numbers');
        return false;
      }
  
      // Check if item already exists
      const existingItemIndex = this.inventory.findIndex(
        item => item.name.toLowerCase() === name.toLowerCase()
      );
  
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        this.inventory[existingItemIndex].quantity += parseInt(quantity);
        alert(`Updated quantity of existing water bottle: ${name}`);
      } else {
        // Add new item
        const newItem = {
          id: Date.now().toString(),
          name: name,
          quantity: parseInt(quantity),
          price: parseFloat(price)
        };
        this.inventory.push(newItem);
        alert(`Added new water bottle: ${name}`);
      }
  
      this.saveInventory();
      this.displayInventory();
      return true;
    }
  
    // Update existing water bottle
    updateItem(id, name, quantity, price) {
      const index = this.inventory.findIndex(item => item.id === id);
      
      if (index === -1) {
        alert('Item not found');
        return false;
      }
  
      if (!name || !quantity || !price) {
        alert('All fields are required');
        return false;
      }
  
      if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
        alert('Quantity and price must be positive numbers');
        return false;
      }
  
      this.inventory[index] = {
        ...this.inventory[index],
        name: name,
        quantity: parseInt(quantity),
        price: parseFloat(price)
      };
  
      this.saveInventory();
      this.displayInventory();
      return true;
    }
  
    // Delete a water bottle from inventory
    deleteItem(id) {
      const index = this.inventory.findIndex(item => item.id === id);
      
      if (index === -1) {
        alert('Item not found');
        return false;
      }
  
      const name = this.inventory[index].name;
      this.inventory.splice(index, 1);
      
      alert(`Deleted water bottle: ${name}`);
      this.saveInventory();
      this.displayInventory();
      return true;
    }
  
    // Search for water bottles
    searchInventory(query) {
      if (!query) {
        this.displayInventory();
        return;
      }
  
      const searchTerm = query.toLowerCase();
      const filteredInventory = this.inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
      );
      
      this.displayInventory(filteredInventory);
    }
  
    // Generate inventory table
    displayInventory(itemsToDisplay = null) {
      const inventoryTable = document.getElementById('inventoryTable');
      const inventoryBody = document.getElementById('inventoryBody');
      const totalValue = document.getElementById('totalValue');
      const itemCount = document.getElementById('itemCount');
      
      // Clear existing rows
      inventoryBody.innerHTML = '';
      
      const items = itemsToDisplay || this.inventory;
      
      if (items.length === 0) {
        inventoryBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center">No water bottles in inventory</td>
          </tr>
        `;
        totalValue.textContent = '$0.00';
        itemCount.textContent = '0';
        return;
      }
  
      // Calculate total inventory value
      let total = 0;
      let totalItems = 0;
  
      // Add each item to the table
      items.forEach(item => {
        const itemValue = item.quantity * item.price;
        total += itemValue;
        totalItems += item.quantity;
  
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${itemValue.toFixed(2)}</td>
          <td>
            <button class="edit-btn" data-id="${item.id}">Edit</button>
            <button class="delete-btn" data-id="${item.id}">Delete</button>
          </td>
        `;
        inventoryBody.appendChild(row);
      });
  
      // Update inventory summary
      totalValue.textContent = `$${total.toFixed(2)}`;
      itemCount.textContent = totalItems;
  
      // Add event listeners to new buttons
      this.addButtonEventListeners();
    }
  
    // Initialize event listeners
    initializeEventListeners() {
      const addItemForm = document.getElementById('addItemForm');
      const searchInput = document.getElementById('searchInput');
      const clearSearch = document.getElementById('clearSearch');
  
      addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('productName');
        const quantityInput = document.getElementById('quantity');
        const priceInput = document.getElementById('price');
  
        const success = this.addItem(
          nameInput.value.trim(),
          quantityInput.value.trim(),
          priceInput.value.trim()
        );
  
        if (success) {
          nameInput.value = '';
          quantityInput.value = '';
          priceInput.value = '';
        }
      });
  
      searchInput.addEventListener('input', (e) => {
        this.searchInventory(e.target.value.trim());
      });
  
      clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        this.displayInventory();
      });
    }
  
    // Add event listeners to edit and delete buttons
    addButtonEventListeners() {
      // Add delete button event listeners
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this water bottle?')) {
            this.deleteItem(id);
          }
        });
      });
  
      // Add edit button event listeners
      document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          const item = this.inventory.find(item => item.id === id);
          
          if (item) {
            document.getElementById('editId').value = item.id;
            document.getElementById('editName').value = item.name;
            document.getElementById('editQuantity').value = item.quantity;
            document.getElementById('editPrice').value = item.price;
            
            // Show edit modal
            document.getElementById('editModal').style.display = 'block';
          }
        });
      });
  
      // Edit form submit
      document.getElementById('editItemForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('editId').value;
        const name = document.getElementById('editName').value.trim();
        const quantity = document.getElementById('editQuantity').value.trim();
        const price = document.getElementById('editPrice').value.trim();
  
        const success = this.updateItem(id, name, quantity, price);
        
        if (success) {
          document.getElementById('editModal').style.display = 'none';
        }
      });
  
      // Close modal
      document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
      });
    }
  
    // Generate reports
    generateLowStockReport(threshold = 10) {
      const lowStockItems = this.inventory.filter(item => item.quantity <= threshold);
      return lowStockItems;
    }
  
    generateInventoryValueReport() {
      let totalValue = 0;
      const itemValues = this.inventory.map(item => {
        const value = item.quantity * item.price;
        totalValue += value;
        return {
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          value: value
        };
      });
  
      return {
        items: itemValues,
        totalValue: totalValue
      };
    }
  }
  
  // Initialize the system
  document.addEventListener('DOMContentLoaded', () => {
    window.inventorySystem = new InventorySystem();
    
    // Add demo data button functionality
    document.getElementById('addDemoData').addEventListener('click', () => {
      if (confirm('Add demo water bottle data to inventory?')) {
        const demoData = [
          { name: "Stainless Steel Water Bottle 20oz", quantity: 45, price: 24.99 },
          { name: "Glass Water Bottle 16oz", quantity: 30, price: 15.99 },
          { name: "Plastic Sports Bottle 32oz", quantity: 80, price: 9.99 },
          { name: "Insulated Water Bottle 24oz", quantity: 25, price: 29.99 },
          { name: "Collapsible Water Bottle 16oz", quantity: 50, price: 12.99 }
        ];
  
        demoData.forEach(item => {
          window.inventorySystem.addItem(item.name, item.quantity, item.price);
        });
      }
    });
  
    // Generate low stock report
    document.getElementById('lowStockReport').addEventListener('click', () => {
      const lowStockItems = window.inventorySystem.generateLowStockReport();
      const reportOutput = document.getElementById('reportOutput');
      
      if (lowStockItems.length === 0) {
        reportOutput.innerHTML = '<p>No low stock items found.</p>';
        return;
      }
  
      let reportHtml = '<h3>Low Stock Report (10 or fewer)</h3>';
      reportHtml += '<table border="1"><tr><th>Product Name</th><th>Quantity</th><th>Action Needed</th></tr>';
      
      lowStockItems.forEach(item => {
        reportHtml += `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.quantity === 0 ? 'Order Immediately' : 'Reorder Soon'}</td>
          </tr>
        `;
      });
      
      reportHtml += '</table>';
      reportOutput.innerHTML = reportHtml;
    });
  
    // Export inventory
    document.getElementById('exportInventory').addEventListener('click', () => {
      const dataStr = JSON.stringify(window.inventorySystem.inventory, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'water-bottle-inventory.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    });
  });
  