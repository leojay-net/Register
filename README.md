# Student Registration DApp

A decentralized application (DApp) for managing student registrations on the Ethereum blockchain. This application consists of a Solidity smart contract for data storage and management, paired with a React frontend for user interaction.

## Features

- Register new students with ID and name
- Remove existing students
- View list of all registered students
- Wallet connection integration with MetaMask
- Admin-only access control
- Real-time updates and notifications

## Smart Contract

The `Register.sol` contract manages student data on the Ethereum blockchain.

### Key Features

- **Student Structure**
  - Student ID
  - Student Name
  - Removal Status

- **Access Control**
  - Admin-only functions
  - Zero-address validation

- **Functions**
  - `registerStudent`: Add new students
  - `removeStudent`: Remove existing students
  - `getStudentById`: Retrieve specific student data
  - `getStudentList`: Get all active students

### Technical Details

- Built with Solidity ^0.8.20
- Uses mappings for efficient data storage
- Implements modifier for admin access control

## Frontend Application

The React frontend provides an intuitive interface for interacting with the smart contract.

### Technologies Used

- React (with Hooks)
- ethers.js for blockchain interaction
- Lucide React for icons
- React Hot Toast for notifications
- Tailwind CSS for styling

### Key Components

1. **Wallet Connection**
   - MetaMask integration
   - Account change handling
   - Network change detection

2. **Student Management**
   - Registration form
   - Student list display
   - Remove functionality

3. **UI Features**
   - Responsive design
   - Loading states
   - Error handling
   - Success notifications

## Setup and Installation

1. Install MetaMask browser extension
2. Clone the repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Contract address
   - Network settings

5. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Connect your MetaMask wallet
2. Ensure you're the admin address
3. Add students using the registration form
4. View and manage students in the list below
5. Use the refresh button to update the list

## Contract Deployment

1. Deploy the smart contract to your chosen network
2. Update the contract address in the React application
3. Ensure the deploying address is set as admin

## Security Considerations

- Admin-only access for critical functions
- Input validation
- Address verification
- State management security

## Error Handling

The application includes comprehensive error handling for:
- Failed transactions
- Network issues
- Invalid inputs
- Unauthorized access attempts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

MIT License
