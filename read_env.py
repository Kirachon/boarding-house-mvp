
try:
    with open('env.cloud', 'r') as f:
        print(f.read())
except Exception as e:
    print(f"Error reading env.cloud: {e}")

try:
    with open('.env.local', 'r') as f:
        print(f.read())
except Exception as e:
    print(f"Error reading .env.local: {e}")
