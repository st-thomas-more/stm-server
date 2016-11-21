# stm-server
Student classroom management server for St. Thomas More (www.stmschoolpa.com)

## Installation
1. Clone this repository - `git clone https://github.com/st-thomas-more/stm-server.git`
2. Install dependencies - `npm install`
3. Create a `.env` file in the root directory containing:
<br>
    MYSQL_USER=YOUR_USER
<br>
    MYSQL_PASSWORD=YOUR_PASSWORD
<br>
    MYSQL_HOST=YOUR_HOST_IP

## Development

Run the server in development mode - `PORT=8080 npm run dev`

## Testing

Run tests including ESLint - `npm test`

## Build

Build the server for production to the `dist` folder - `npm run build`

## Production
Start the production server - `PORT=8080 npm start`