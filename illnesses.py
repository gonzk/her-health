import csv

import requests
from bs4 import BeautifulSoup
from googlesearch import search

illness = [
    "Alzheimer’s Disease",
    "Breast Cancer",
    "endometriosis",
    "Uterine fibroids",
    "Cervical cancer",
    "Ovarian cancer",
    "Uterine cancer",
    "Vaginal cancer",
    "Vulvar cancer",
    "HIV/AIDS",
    "Interstitial Cystitis",
    "Polycystic Ovary Syndrome",
    "Osteoarthritis",
    "Depression",
    "Heart disease",
    "Anxiety",
    "Lupus",
    "chronic fatigue syndrome",
    "multiple sclerosis"
]


def create_file(illnesses):
    disease = {}
    for i in illnesses:
        link = find_symptoms(i)
        disease[i] = get_symptoms(link)
    with open('health.csv', mode='w') as file:
        write = csv.DictWriter(file, fieldnames=illnesses)
        write.writeheader()
        write.writerows([disease])


def find_symptoms(illness: str) -> str:
    """
    :param illness: an illness most prevalent in women
    :return: a website of the symotoms search result for that illness
    """
    query = illness + "symptoms mayoclinic"

    for s in search(query, tld='com', lang='en', num=1, start=0, stop=1, pause=3):
        return s


def get_symptoms(link: str):
    """
    :param link: link of the website result of an illness
    :return: a dictionary of the symptoms and information
    """
    page = requests.get(link)

    soup = BeautifulSoup(page.content, 'html.parser')
    results = soup.find_all('h2')
    dicts = {"link": link}
    for h in results[0:4]:
        key = h.get_text(strip=True)
        if 'Overview' in key:
            para = h.find_next_sibling('p')
            dicts[key] = para.text
        else:
            para = h.find_next_sibling('ul')
            dicts[key] = para.text

    return dicts


create_file(illnesses=illness)
