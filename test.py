from werkzeug.security import generate_password_hash, check_password_hash

password = "1234"

hashed_password = generate_password_hash(password)

print("Hashed Password:", hashed_password)

