<template>
  <div v-if="isSuccess" class="success">
    <h2>Регистрация успешно завершена</h2>
  </div>
  <div v-else class="form">
    <div class="form-header">Регистрация</div>

    <div class="form-checkbox-public-profile">
      <label
        for="checkbox-public-profile"
        class="form-checkbox-public-profile-wrapper"
      >
        <input
          class="form-checkbox-public-profile-checkbox"
          id="checkbox-public-profile"
          type="checkbox"
          name="public-profile"
          :checked="isPublic"
          @click="onPublicProfile"
        />
        <span></span>
        <div class="form-checkbox-public-profile-title noselect">
          Публичный профиль
        </div>
      </label>
      <div class="form-checkbox-public-profile-text">
        Включает профиль для просмотра другими пользователями по ссылке
      </div>
    </div>

    <div class="form-data">
      <div class="form-data-title">Данные</div>
      <div class="form-fields-wrapper">
        <div class="form-field-wrapper">
          <input
            class="form-field"
            placeholder="Имя"
            :value="username"
            @change="onChangeUsername"
          />
          <div v-if="username_error" class="form-data-error">
            {{ username_error }}
          </div>
        </div>
        <div class="select-wrapper">
          <select class="form-field" v-model="role">
            <option
              v-for="(option, index) in options"
              :key="index"
              :value="option.value"
              :selected="option.value === role"
            >
              {{ option.text }}
            </option>
          </select>
          <div class="arrow"></div>
        </div>
        <div class="form-field-wrapper">
          <input
            class="form-field"
            placeholder="Email"
            :value="email"
            @change="onChangeEmail"
          />
          <div v-if="email_error" class="form-data-error">
            {{ email_error }}
          </div>
        </div>
      </div>
      <div class="form-fields-wrapper">
        <div class="form-field-wrapper">
          <input
            class="form-field"
            type="password"
            placeholder="Пароль"
            :value="password"
            @change="onChangePassword"
          />
          <div v-if="password_error" class="form-data-error">
            {{ password_error }}
          </div>
        </div>
        <div class="form-field-wrapper">
          <input
            class="form-field"
            type="password"
            placeholder="Повторите пароль"
            :value="password_repeat"
            @change="onChangePasswordRepeat"
          />
          <div v-if="password_repeat_error" class="form-data-error">
            {{ password_repeat_error }}
          </div>
        </div>
      </div>
    </div>

    <div class="form-checkbox-consent-wrapper">
      <label for="checkbox-consent" class="form-checkbox-consent">
        <input
          class="form-checkbox-consent-checkbox"
          type="checkbox"
          id="checkbox-consent"
          name="consent"
          :checked="isConsent"
          @click="onConsent"
        />
        <span></span>
        <div class="form-checkbox-consent-title noselect">
          Нажимая на кнопку “Регистрация”, я подтверждаю свое согласение с
          политикой конфиденциальности и обработки персональных данных
        </div>
      </label>
    </div>
    <div class="form-button-wrapper">
      <button
        class="form-button noselect"
        :disabled="!isConsent"
        @click="onSubmit"
      >
        Регистрация
      </button>
    </div>
  </div>
</template>

<script>
import { Roles } from "@/constants/roles.js";

export default {
  name: "Registration",

  props: {
    defaultValues: {
      default: {},
      type: Object
    }
  },

  data() {
    return {
      options: [
        {
          text: "Должность",
          value: 0
        },
        {
          text: Roles.student.text,
          value: Roles.student.value
        },
        {
          text: Roles.teacher.text,
          value: Roles.teacher.value
        },
        {
          text: Roles.dean.text,
          value: Roles.dean.value
        }
      ],
      isPublic: false,
      isConsent: true,
      username: this.defaultValues.username,
      username_error: "",
      email: this.defaultValues.email,
      email_error: "",
      role: this.defaultValues.role || 0,
      password: "",
      password_error: "",
      password_repeat: "",
      password_repeat_error: "",
      isSuccess: false
    };
  },

  methods: {
    onConsent() {
      this.isConsent = !this.isConsent;
    },
    onPublicProfile() {
      this.isPublic = !this.isPublic;
    },
    onChangeUsername(e) {
      this.username = e.target.value;
    },
    onChangeEmail(e) {
      this.email = e.target.value;
    },
    onChangePassword(e) {
      this.password = e.target.value;
    },
    onChangePasswordRepeat(e) {
      this.password_repeat = e.target.value;
    },

    async onSubmit() {
      const data = {
        public: this.isPublic ? 1 : 0,
        username: this.username,
        role: this.role,
        email: this.email,
        password: this.password,
        password_repeat: this.password_repeat
      };

      const response = await fetch(
        "https://lmstestapi.reezonly.com/v1/user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      if (response.ok) {
        const json = await response.json();

        if (json.success) {
          this.isSuccess = true;
        } else {
          const { username, email, password, password_repeat } = json.errors;
          this.username_error = username ? username[0] : "";
          this.email_error = email ? email[0] : "";
          this.password_error = password ? password[0] : "";
          this.password_repeat_error = password_repeat
            ? password_repeat[0]
            : "";
        }
      } else {
        console.log("Ошибка HTTP: " + response.status);
      }
    }
  }
};
</script>

<style scoped>
.form {
  text-decoration: inherit;
  color: var(--color-base-0);
  background-color: var(--color-gray-0);
  border-radius: var(--radius-2);
  padding: var(--indent-2) var(--indent-1);
  max-width: 958px;
  margin: 0 auto;
  text-align: center;
}

.form-header {
  width: 100%;
  color: var(--color-base-0);
  font: var(--font-heading-bold);
  border-bottom: 1px solid var(--color-gray-1);
  text-align: left;
  padding: 0 var(--indent-1);
  padding-bottom: var(--indent-2);
  margin: 0 -20px;
}

.form-checkbox-public-profile {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-0);
  height: 50px;
  text-align: left;
  padding: var(--indent-2) 0;
  font: var(--font-body-small);
  border-bottom: 1px solid var(--color-gray-1);
}

.form-checkbox-public-profile-wrapper {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--gap-0);
  align-items: center;
  cursor: pointer;
}

/* Dafault */
.form-checkbox-public-profile-checkbox + span {
  border-radius: 5px;
  flex-shrink: 0;
  border: 1px solid var(--color-gray-1);
  background-color: transparent;
  border-radius: 100px;
  width: 39px;
  height: 19px;
  cursor: pointer;
}

.form-checkbox-public-profile-checkbox + span::before {
  content: "";
  display: inline-block;
  width: 19px;
  height: 19px;
  margin-top: -1px;
  margin-left: -1px;
  border: 1px solid var(--color-gray-4);
  border-radius: 50%;
  background-color: var(--color-gray-0);
  transition: all 0.2s ease;
}

/* Focus */
.form-checkbox-public-profile-checkbox:focus + span {
  cursor: pointer;
}

/* Checked */
.form-checkbox-public-profile-checkbox:checked + span {
  border: 1px solid transparent;
  background-color: var(--color-purple-0);
}

.form-checkbox-public-profile-checkbox:checked + span::before {
  content: "";
  display: inline-block;
  width: 19px;
  height: 19px;
  margin-top: -1px;
  margin-left: 19px;
  border: 1px solid var(--color-gray-4);
  border-radius: 50%;
  background-color: var(--color-gray-0);
  transition: all 0.2s ease;
}

.form-checkbox-public-profile-title {
  font: var(--font-heading-SemiBold);
  color: var(--color-base-0);
}

.form-checkbox-public-profile-text {
  width: 100%;
  color: var(--color-gray-3);
}

.form-data {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-2);
  padding-bottom: var(--indent-3);
  border-bottom: 1px solid var(--color-gray-1);
}

.form-data-title {
  width: 100%;
  text-align: left;
  margin-top: var(--indent-1);
  font: var(--font-heading-SemiBold);
  color: var(--color-base-0);
}

.form-fields-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--gap-1);
  row-gap: var(--gap-2);
}

.form-field-wrapper {
  position: relative;
  flex-basis: var(--flex-basis);
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
}

.form-data-error {
  position: absolute;
  top: var(--indent-6);
  left: var(--indent-0);
  color: var(--color-red-0);
  font: var(--font-body-small);
}

.form-field {
  flex-basis: var(--flex-basis);
  max-width: var(--max-width);
  padding: var(--indent-0);
  flex-grow: 1;
  color: var(--color-gray-2);
  font: var(--font-body-small);
  background-color: transparent;
  border-radius: var(--radius-1);
  border: 1px solid var(--color-gray-1);
}

.form-field:focus,
.form-field:focus-visible {
  outline: 1px solid var(--color-gray-2);
}

.form-checkbox-consent-wrapper {
  width: 100%;
  display: flex;
}

.form-checkbox-consent {
  display: flex;
  flex-wrap: nowrap;
  flex-grow: 0;
  align-items: flex-start;
  text-align: left;
  column-gap: var(--gap-0);
  margin-top: var(--indent-4);
  margin-bottom: var(--indent-5);
}

.form-checkbox-public-profile-checkbox,
.form-checkbox-consent-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
  display: block;
  width: 0;
  height: 0;
}

/* Dafault */
.form-checkbox-consent-checkbox + span {
  border-radius: var(--radius-0);
  flex-shrink: 0;
  border: 2px solid var(--color-gray-1);
  background-color: white;
  width: 18px;
  height: 17px;
  cursor: pointer;
}

.form-checkbox-consent-checkbox + span::before {
  content: "";
  color: var(--color-base-0);
}

/* Focus */
.form-checkbox-consent-checkbox:focus + span {
  cursor: pointer;
}

/* Checked */
.form-checkbox-consent-checkbox:checked + span {
  background-image: url("/src/assets/images/svg/сheckbox.svg");
  background-position: left -2px;
  background-repeat: no-repeat;
  border: 2px solid transparent;
  background-color: var(--color-yellow-0);
}

.form-checkbox-consent-title {
  max-width: 690px;
  cursor: pointer;
}

.form-button-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--indent-1);
}
.form-button {
  cursor: pointer;
  padding: var(--indent-0);
  border-radius: var(--radius-3);
  width: 234px;
  border: 1px solid var(--color-green-0);
  background-color: var(--color-gray-0);
  color: var(--color-green-0);
  font: var(--font-body-small);
}

.form-button:hover {
  background-color: var(--color-gray-1);
  color: var(--color-gray-0);
}

.form-button:disabled {
  background-color: transparent;
  cursor: auto;
  opacity: 0.5;
  color: var(--color-gray-2);
  border: 1px solid var(--color-gray-2);
}

.success {
  width: 100%;
  display: flex;
  place-items: center;
  min-width: var(--min-width);
  min-height: var(--min-height);
  color: var(--color-gray-0);
  background-color: var(--color-green-0);
}

.success h2 {
  text-align: center;
  line-height: var(--line-height);
  margin: 0 auto;
}
</style>
