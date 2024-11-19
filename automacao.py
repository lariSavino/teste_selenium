from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
import time

navegador = webdriver.Firefox()
#teste para adicionar tarefa 
navegador.get("http://127.0.0.1:5500/projeto_fic/build/index.html")
navegador.find_element(By.XPATH, '//*[@id="todo-input"]').click() 
navegador.find_element(By.XPATH, '//*[@id="todo-input"]').send_keys("Estudar javascript")

navegador.find_element(By.XPATH, '//*[@id="data"]').send_keys("19-11-2024T15:30")
navegador.find_element(By.XPATH, '/html/body/div[1]/form/button').click()
