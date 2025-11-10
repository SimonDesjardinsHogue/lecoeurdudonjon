#!/bin/bash

# Test script for LAN multiplayer functionality

echo "🧪 Testing LAN Multiplayer Implementation"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Start server in background
echo "Starting test server..."
cd server
node server.js > /tmp/test-server.log 2>&1 &
SERVER_PID=$!
cd ..
sleep 3

echo ""
echo "Running API tests:"
echo "------------------"

# Test 1: Health check
run_test "Server health check" "curl -s http://localhost:3000/api/health | grep -q '\"status\":\"ok\"'"

# Test 2: Empty leaderboard
run_test "Get empty leaderboard" "curl -s http://localhost:3000/api/leaderboard | grep -q '\"success\":true'"

# Test 3: Submit score
run_test "Submit score" "curl -s -X POST http://localhost:3000/api/score -H 'Content-Type: application/json' -d '{\"playerId\":\"test1\",\"playerName\":\"Hero\",\"level\":5,\"kills\":10,\"gold\":100}' | grep -q '\"success\":true'"

# Test 4: Get leaderboard with scores
run_test "Get leaderboard with scores" "curl -s http://localhost:3000/api/leaderboard | grep -q '\"playerName\":\"Hero\"'"

# Test 5: Get player scores
run_test "Get player scores" "curl -s http://localhost:3000/api/player/test1 | grep -q '\"count\":1'"

echo ""
echo "Running static file serving tests:"
echo "-----------------------------------"

# Test 6: Serve index.html
run_test "Serve index.html" "curl -s -I http://localhost:3000/ | grep -q 'Content-Type: text/html'"

# Test 7: Serve JavaScript files
run_test "Serve JavaScript files" "curl -s -I http://localhost:3000/js/network.js | grep -q 'Content-Type: application/javascript'"

# Test 8: Serve CSS files
run_test "Serve CSS files" "curl -s -I http://localhost:3000/style.css | grep -q 'Content-Type: text/css'"

# Test 9: CORS headers present
run_test "CORS headers present" "curl -s -I http://localhost:3000/ | grep -q 'Access-Control-Allow-Origin'"

echo ""
echo "Running client module tests:"
echo "----------------------------"

# Test 10: Load network.js module
run_test "Load network.js" "node --input-type=module -e \"import('./js/network.js').then(() => process.exit(0))\""

# Test 11: Check if main.js imports network module
run_test "main.js imports network" "grep -q \"import.*network.js\" js/main.js"

# Test 12: Check if game-logic.js imports network module
run_test "game-logic.js imports network" "grep -q \"import.*network.js\" js/game-logic.js"

# Test 13: Check if combat.js imports network module
run_test "combat.js imports network" "grep -q \"import.*network.js\" js/combat.js"

echo ""
echo "Running file structure tests:"
echo "-----------------------------"

# Test 14: Check server files exist
run_test "server.js exists" "test -f server/server.js"
run_test "package.json exists" "test -f server/package.json"
run_test "Server README exists" "test -f server/README.md"
run_test "Start scripts exist" "test -f server/start-server.sh && test -f server/start-server.bat"

# Test 15: Check client files exist
run_test "network.js exists" "test -f js/network.js"
run_test "multiplayer-ui.js exists" "test -f js/multiplayer-ui.js"

# Test 16: Check HTML has multiplayer screen
run_test "Multiplayer settings screen in HTML" "grep -q 'multiplayerSettingsScreen' index.html"

# Test 17: Check scores persist
run_test "Scores persisted to file" "test -f server/scores.json"

# Cleanup
echo ""
echo "Cleaning up..."
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

# Summary
echo ""
echo "=========================================="
echo "Test Summary:"
echo "------------------"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo "=========================================="
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed.${NC}"
    exit 1
fi
