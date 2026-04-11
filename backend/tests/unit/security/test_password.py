from backend.infra.security.password import hash_password, verify_password


def test_password_gets_hashed():
    hashed = hash_password("my-password")
    assert hashed != "my-password"


def test_correct_password_gets_verified():
    hashed = hash_password("my-password")
    assert verify_password("my-password", hashed)


def test_wrong_password_fails_verification():
    hashed = hash_password("my-password")
    assert not verify_password("wrong-password", hashed)
