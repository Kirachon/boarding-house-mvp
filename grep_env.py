
def check_file(filename):
    try:
        with open(filename, 'r') as f:
            for line in f:
                if 'PASSWORD' in line.upper() or 'SECRET' in line.upper() or 'KEY' in line.upper():
                    print(f"{filename}: {line.strip()}")
    except Exception as e:
        print(f"Error {filename}: {e}")

check_file('env.cloud')
check_file('.env.local')
