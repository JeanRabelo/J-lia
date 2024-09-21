from requests import post

def send_new_user(user, password):
    url = 'https://localhost:8080/register'
    data = {
    'username': user,
    'password': password
    }
    response = post(url, json=data)
    print(response.json())

# send_new_user(, )
