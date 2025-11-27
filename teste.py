import requests

url = "http://192.168.15.2:5000/comunicados/professor/seuemail@dominio.com"
res = requests.get(url)

print("Status code:", res.status_code)
print("Resposta bruta:", res.text)


if res.status_code == 200:
    data = res.json()
    print(data)
else:
    print("Erro na requisição")
