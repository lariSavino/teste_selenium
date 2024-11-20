from selenium import webdriver 
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
import time
from webdriver_manager.firefox import GeckoDriverManager


navegador = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()))
navegador.get("http://127.0.0.1:5500/projeto_fic/build/index.html")

# Função para adicionar uma tarefa
def adicionar_tarefa(titulo, data_hora):
    navegador.find_element(By.XPATH, '//*[@id="todo-input"]').click()
    navegador.find_element(By.XPATH, '//*[@id="todo-input"]').send_keys(titulo)
    navegador.find_element(By.XPATH, '//*[@id="data"]').send_keys(data_hora)
    navegador.find_element(By.XPATH, '/html/body/div[1]/form/button').click()
    time.sleep(1)  # Esperar um pouco para garantir que a tarefa foi adicionada

# Adicionar tarefas
adicionar_tarefa("Estudar JavaScript", "19-11-2024T15:30")
adicionar_tarefa("Revisar Python", "20-11-2024T10:00")
adicionar_tarefa("Praticar Selenium", "21-11-2024T18:00")

#marcar tarefa como concluída 
navegador.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[1]/button[1]').click()

#editar tarefa 
navegador.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[2]/button[2]').click()
campo_nome_update = navegador.find_element(By.XPATH, '//*[@id="nome-update"]')
campo_nome_update.click()
campo_nome_update.clear()  # Limpa o campo antes de inserir o novo texto
campo_nome_update.send_keys("Estudar CSS")

