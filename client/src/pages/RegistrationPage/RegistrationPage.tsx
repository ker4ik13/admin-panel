"use client";
import { AuthService } from "@/services/auth.service";
import { IError } from "@/shared/types/IError";
import { CreateUserDto } from "@/shared/types/user/CreateUser.dto";
import { SubmitButton } from "@/shared/ui/SubmitButton";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import s from "./RegistrationPage.module.scss";

interface RegistrationUserDto extends CreateUserDto {
  repeatPassword: string;
}

const RegistrationPage = () => {
  const [errors, setErrors] = useState<IError[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onSubmit = async (values: RegistrationUserDto) => {
    setErrors([]);
    setLoading(true);

    const newUser: CreateUserDto = {
      name: values.name,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };

    const response = await AuthService.registration(newUser);
    console.log(response);

    if (response.status === 201) {
      setLoading(false);
      router.push("/admin/auth");
    }

    if (response.status !== 201) {
      const errors: IError[] = [];
      setLoading(false);

      response.data.message.map((error: string) => {
        errors.push({
          isError: true,
          text: error,
        });
      });

      setErrors(errors);
    }
  };

  return (
    <div className={s.page}>
      {errors.map((error) => (
        <p className="error_text" key={error.text}>
          {error.text}
        </p>
      ))}
      <Form
        form={form}
        name="basic"
        className={s.form}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onSubmit}
      >
        <Form.Item<RegistrationUserDto>
          className={s.input}
          label="Имя"
          name="name"
          hasFeedback
          validateDebounce={500}
          rules={[
            { required: true, message: "Поле обязательно" },
            { min: 2, message: "Минимум 2 символа" },
          ]}
        >
          <Input
            autoComplete="name"
            placeholder="Иван"
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item<RegistrationUserDto>
          className={s.input}
          label="Фамилия"
          name="lastName"
          hasFeedback
          validateDebounce={500}
          rules={[
            { required: true, message: "Поле обязательно" },
            { min: 2, message: "Минимум 2 символа" },
          ]}
        >
          <Input
            autoComplete="surname"
            placeholder="Иванов"
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item<RegistrationUserDto>
          className={s.input}
          label="Почта"
          name="email"
          hasFeedback
          validateDebounce={700}
          rules={[
            { required: true, message: "Поле обязательно" },
            { type: "email", message: "Введите почту" },
          ]}
        >
          <Input
            autoComplete="email"
            placeholder="youremail@gmail.com"
            prefix={<MailOutlined />}
          />
        </Form.Item>

        <Form.Item<RegistrationUserDto>
          className={s.input}
          label="Пароль"
          name="password"
          hasFeedback
          validateDebounce={700}
          rules={[
            { required: true, message: "Введите пароль!" },
            { min: 8, message: "Пароль должен быть не меньше 8 символов" },
          ]}
        >
          <Input.Password
            autoComplete="password"
            minLength={8}
            prefix={<LockOutlined />}
          />
        </Form.Item>

        <Form.Item<RegistrationUserDto>
          className={s.input}
          label="Повторите пароль"
          name="repeatPassword"
          hasFeedback
          dependencies={["password"]}
          validateDebounce={700}
          rules={[
            { required: true, message: "Повторите пароль!" },
            { min: 8, message: "Пароль должен быть не меньше 8 символов" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password minLength={8} prefix={<LockOutlined />} />
        </Form.Item>

        <Link className={s.link} href={"/admin/auth"}>
          Есть аккаунт? Войти
        </Link>

        <Form.Item className={s.buttonWrapper}>
          <SubmitButton
            form={form}
            onSubmit={onSubmit}
            className={s.button}
            loading={loading}
          >
            Создать
          </SubmitButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegistrationPage;
