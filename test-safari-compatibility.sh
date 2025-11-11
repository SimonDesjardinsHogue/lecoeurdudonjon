#!/bin/bash

# Test script for Safari/iPad compatibility fixes

echo "🍎 Testing Safari/iPad Compatibility Fixes"
echo "==========================================="
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

echo "Client-Side Network Configuration Tests:"
echo "----------------------------------------"

# Test 1: WebSocket transport order is Safari-compatible (polling first)
run_test "WebSocket transports order" "grep -q \"transports: \['polling', 'websocket'\]\" js/network.js"

# Test 2: Socket.IO has timeout configuration
run_test "Socket.IO timeout configured" "grep -q \"timeout: 20000\" js/network.js"

# Test 3: Reconnection is enabled
run_test "Reconnection enabled" "grep -q \"reconnection: true\" js/network.js"

# Test 4: Reconnection attempts configured
run_test "Reconnection attempts set" "grep -q \"reconnectionAttempts: 5\" js/network.js"

# Test 5: Fetch requests have AbortController timeout
run_test "Fetch timeout with AbortController" "grep -q \"AbortController\" js/network.js"

# Test 6: Fetch requests have CORS mode
run_test "CORS mode in fetch" "grep -q \"mode: 'cors'\" js/network.js"

# Test 7: Fetch requests disable cache
run_test "Cache disabled in fetch" "grep -q \"cache: 'no-cache'\" js/network.js"

# Test 8: Upgrade option enabled
run_test "Upgrade enabled" "grep -q \"upgrade: true\" js/network.js"

# Test 9: Remember upgrade enabled
run_test "Remember upgrade enabled" "grep -q \"rememberUpgrade: true\" js/network.js"

echo ""
echo "Server-Side Configuration Tests:"
echo "--------------------------------"

# Test 10: Server has polling transport first
run_test "Server polling transport first" "grep -q \"transports: \['polling', 'websocket'\]\" server/server.js"

# Test 11: Server has increased ping timeout
run_test "Server ping timeout" "grep -q \"pingTimeout: 60000\" server/server.js"

# Test 12: Server has ping interval
run_test "Server ping interval" "grep -q \"pingInterval: 25000\" server/server.js"

# Test 13: Server has upgrade timeout
run_test "Server upgrade timeout" "grep -q \"upgradeTimeout: 30000\" server/server.js"

# Test 14: Server allows upgrades
run_test "Server allows upgrades" "grep -q \"allowUpgrades: true\" server/server.js"

# Test 15: Server has cookies disabled for Safari
run_test "Server cookies disabled" "grep -q \"cookie: false\" server/server.js"

# Test 16: Server supports older Engine.IO clients
run_test "Server allows EIO3" "grep -q \"allowEIO3: true\" server/server.js"

echo ""
echo "Documentation Tests:"
echo "-------------------"

# Test 17: Troubleshooting guide updated
run_test "Safari fixes documented" "grep -q \"Correctifs Safari/iPad\" TROUBLESHOOTING_MULTIJOUEUR.md"

# Test 18: Clear cache instructions present
run_test "Clear cache instructions" "grep -q \"Videz le cache Safari\" TROUBLESHOOTING_MULTIJOUEUR.md"

# Test 19: Restart server instructions
run_test "Restart server instructions" "grep -q \"Redémarrez le serveur\" TROUBLESHOOTING_MULTIJOUEUR.md"

echo ""
echo "Integration Tests:"
echo "-----------------"

# Start server in background
echo "Starting test server..."
cd server
node server.js > /tmp/test-safari-server.log 2>&1 &
SERVER_PID=$!
cd ..
sleep 3

# Test 20: Server responds with CORS headers
run_test "CORS headers in response" "curl -s -I http://localhost:3000/api/health | grep -q 'Access-Control-Allow-Origin'"

# Test 21: API responds within timeout (< 10s)
START_TIME=$(date +%s)
curl -s http://localhost:3000/api/health > /dev/null 2>&1
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
run_test "API responds quickly (<10s)" "test $DURATION -lt 10"

# Test 22: WebSocket endpoint available
run_test "WebSocket endpoint available" "curl -s http://localhost:3000/socket.io/ | grep -q 'Transport\|message'"

# Test 23: Health endpoint returns proper JSON
run_test "Health endpoint JSON format" "curl -s http://localhost:3000/api/health | python3 -m json.tool > /dev/null 2>&1"

# Cleanup
echo ""
echo "Cleaning up..."
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

# Summary
echo ""
echo "==========================================="
echo "Test Summary:"
echo "------------------"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo "==========================================="
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All Safari compatibility tests passed!${NC}"
    echo ""
    echo "Safari/iPad fixes verified:"
    echo "  ✓ WebSocket transport order optimized"
    echo "  ✓ Timeout handling implemented"
    echo "  ✓ Reconnection logic configured"
    echo "  ✓ CORS properly configured"
    echo "  ✓ Server settings optimized"
    echo "  ✓ Documentation updated"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some tests failed.${NC}"
    echo "Please review the failed tests above."
    exit 1
fi
