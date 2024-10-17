import { ReactNode } from "react";

import Content from "../Content";

import { TemplateStyled } from "./styled";

import clsx from "clsx";
import Sidebar from "../Sidebar";
import Header from "@/layouts/Header";

export interface TemplateProps {
  className?: string;
  children: ReactNode;
}

const Template = ({ className, children }: TemplateProps) => {
  return (
    <TemplateStyled className={clsx("Template", className)}>
      <Header />
      <Sidebar />
      <Content>{children}</Content>
    </TemplateStyled>
  );
};

export default Template;
