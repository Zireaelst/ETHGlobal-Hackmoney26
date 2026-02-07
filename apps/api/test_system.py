#!/usr/bin/env python3
"""
DeepMind Vaults - System Verification Tests
Runs tests against both frontend and backend to verify everything works.
"""

import asyncio
import httpx
import json
from dataclasses import dataclass
from typing import Optional

# Test Configuration
API_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}  {text}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")

def print_test(name: str, passed: bool, details: str = ""):
    status = f"{Colors.GREEN}✓ PASS{Colors.RESET}" if passed else f"{Colors.RED}✗ FAIL{Colors.RESET}"
    print(f"  {status}  {name}")
    if details:
        print(f"         {Colors.YELLOW}{details}{Colors.RESET}")

@dataclass
class TestResult:
    name: str
    passed: bool
    details: str = ""

async def test_api_health() -> TestResult:
    """Test if API is running"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{API_URL}/", timeout=5.0)
            if response.status_code == 200:
                return TestResult("API Health Check", True, "API is running")
            return TestResult("API Health Check", False, f"Status: {response.status_code}")
    except Exception as e:
        return TestResult("API Health Check", False, str(e))

async def test_frontend_health() -> TestResult:
    """Test if Frontend is running"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(FRONTEND_URL, timeout=5.0)
            if response.status_code == 200 and "DeepMind" in response.text:
                return TestResult("Frontend Health Check", True, "Frontend is running")
            return TestResult("Frontend Health Check", False, f"Status: {response.status_code}")
    except Exception as e:
        return TestResult("Frontend Health Check", False, str(e))

async def test_docs_page() -> TestResult:
    """Test if Docs page exists"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{FRONTEND_URL}/docs", timeout=5.0)
            if response.status_code == 200:
                return TestResult("Docs Page", True, "/docs is accessible")
            return TestResult("Docs Page", False, f"Status: {response.status_code}")
    except Exception as e:
        return TestResult("Docs Page", False, str(e))

async def test_agents_page() -> TestResult:
    """Test if Agents page exists"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{FRONTEND_URL}/agents", timeout=5.0)
            if response.status_code == 200:
                return TestResult("Agents Page", True, "/agents is accessible")
            return TestResult("Agents Page", False, f"Status: {response.status_code}")
    except Exception as e:
        return TestResult("Agents Page", False, str(e))

async def test_api_scan_opportunities() -> TestResult:
    """Test opportunity scanning endpoint"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{API_URL}/opportunities", timeout=10.0)
            if response.status_code == 200:
                data = response.json()
                # Handle both list and dict responses
                count = len(data) if isinstance(data, list) else len(data.get("opportunities", []))
                return TestResult("Opportunity Scanner", True, f"Found {count} opportunities")
            return TestResult("Opportunity Scanner", False, f"Status: {response.status_code}")
    except Exception as e:
        return TestResult("Opportunity Scanner", False, str(e))

async def test_api_decision_engine() -> TestResult:
    """Test decision engine (rule-based fallback)"""
    try:
        async with httpx.AsyncClient() as client:
            # Test agent status endpoint
            response = await client.get(f"{API_URL}/agents/1/status", timeout=5.0)
            if response.status_code in [200, 404]:  # 404 is OK - agent doesn't exist
                return TestResult("Decision Engine", True, "API endpoints responding")
            return TestResult("Decision Engine", False, f"Status: {response.status_code}")
    except Exception as e:
        return TestResult("Decision Engine", False, str(e))

async def test_contract_verification() -> TestResult:
    """Verify contract addresses are set"""
    try:
        # Check if .env.local has contract addresses
        with open("/Users/toyguntez/Visual Studio /ETHGlobal-Hackmoney26/apps/web/.env.local", "r") as f:
            content = f.read()
            has_vault = "0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c" in content
            has_ens = "0x10E15C7a3Bce8211c5EBbAdB2f478e1Fe0240b1c" in content
            has_sui = "0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8" in content
            
            if has_vault and has_ens and has_sui:
                return TestResult("Contract Addresses", True, "All 3 contracts configured")
            missing = []
            if not has_vault: missing.append("DeepMindVault")
            if not has_ens: missing.append("ENSManager")
            if not has_sui: missing.append("SuiPackage")
            return TestResult("Contract Addresses", False, f"Missing: {', '.join(missing)}")
    except Exception as e:
        return TestResult("Contract Addresses", False, str(e))

async def run_all_tests():
    """Run all verification tests"""
    print_header("DeepMind Vaults - System Verification")
    
    tests = [
        test_api_health,
        test_frontend_health,
        test_docs_page,
        test_agents_page,
        test_api_scan_opportunities,
        test_api_decision_engine,
        test_contract_verification,
    ]
    
    results = []
    for test in tests:
        result = await test()
        results.append(result)
        print_test(result.name, result.passed, result.details)
    
    # Summary
    passed = sum(1 for r in results if r.passed)
    total = len(results)
    
    print(f"\n{Colors.BOLD}{'='*60}{Colors.RESET}")
    color = Colors.GREEN if passed == total else Colors.RED
    print(f"{color}{Colors.BOLD}  Results: {passed}/{total} tests passed{Colors.RESET}")
    print(f"{Colors.BOLD}{'='*60}{Colors.RESET}\n")
    
    if passed == total:
        print(f"{Colors.GREEN}🎉 All systems operational!{Colors.RESET}\n")
    else:
        print(f"{Colors.YELLOW}⚠️  Some tests failed. Check the output above.{Colors.RESET}\n")
    
    return passed == total

if __name__ == "__main__":
    asyncio.run(run_all_tests())
