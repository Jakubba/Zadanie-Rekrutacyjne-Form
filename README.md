# Formularz - zadanie rekrutacyjne 

Aplikacja to prosty formularz rejestracyjny umożliwiający zapis na trening. Użytkownik wprowadza swoje dane, wybiera termin, a następnie potwierdza zgłoszenie. Aplikacja zapewnia intuicyjny interfejs i szybki proces rejestracji. 

## 📌 Funkcjonalności

1. Formularz rejestracyjny

    Imię i nazwisko – pole tekstowe do wpisania danych osobowych.
    Adres e-mail – pole do podania e-maila w celu potwierdzenia rejestracji.
    Wiek – suwak do zaznaczenia wieku w przedziale od 8 do 100 lat.
    Zdjęcie - pole do wgrania swojego zdjęcia.

2. Wybór terminu treningu

    Kalendarz – interaktywny wybór miesiąca, dnia treningu.
    Godzina treningu – lista dostępnych godzin do wyboru.

3. Walidacja danych

    Sprawdzenie, czy wszystkie wymagane pola są wypełnione.
    Walidacja poprawności e-maila i wieku.

## 🛠 Technologie

- React
- TypeScript
- Tailwind CSS
- Sass
- React Calendar
- Prettier


## 🚀 Instalacja i uruchomienie

1. **Sklonuj repozytorium**:

   ```sh
   git clone <https://github.com/Jakubba/Zadanie-Rekrutacyjne-Form>
   cd <Zadanie-Rekrutacyjne-Form>
   ```

2. **Zainstaluj zależności**:

   ```sh
   npm install
   npm install tailwindcss @tailwindcss/vite
   npm install --save-dev prettier
   npm install sass
   npm install react-calendar
   npm instal dotenv
   ```

3. **Uruchom aplikację**:

   ```sh
   npm run dev
   ```

   Aplikacja będzie dostępna pod adresem `http://localhost:5173/` (jeśli używasz Vite).

## 📂 Struktura projektu

```
📦 src
 ┣ 📂 components    # Komponenty formularza
 ┣ 📂 styles        # Style Sass
 ┗ 📜 main.tsx      # Punkt wejściowy aplikacji
```

## 📜 Licencja

Projekt dostępny na licencji MIT.

---

📌 **Autor:** 
Jakub Barszcz
