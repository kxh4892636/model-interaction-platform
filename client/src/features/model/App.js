import { Layout } from "antd";
// import MyHeader from "./components/Header"
import MySider from "./components/Sider";

//路由
import { useRoutes, useNavigate } from "react-router-dom";
import routes from "./route";

export default function App() {
  const { Sider, Content } = Layout;
  const element = useRoutes(routes);
  const navigate = useNavigate();
  //利用父传子函数，回调函数去实现路由切换
  //路由链接编写注册最终都会在app页面中，navigate必须和他们在一起，才能发挥作用，所以采用函数父子通讯实现切换
  function test(route) {
    // console.log(navigate)
    navigate(route);
  }

  return (
    <Layout style={{ height: "100%", position: "relative" }}>
      {/* <Header className="header" style={{backgroundColor:"black",height:"48px",lineHeight:"48px"}}>
          <MyHeader></MyHeader>
        </Header> */}
      <Layout style={{ height: "94vh" }}>
        <Sider width={250} style={{ background: "#fff", paddingTop: "10px" }}>
          <MySider routechange={test}></MySider>
        </Sider>
        <Layout>
          {/* <Layout style={{ padding: '0 24px 24px' }}> */}
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "white",
              border: "1px solid rgb(172,172,172)",
              // borderRadius:"5px"
              boxShadow: "inset 2px 2px 5px #838a8c",
            }}
          >
            {/* 路由注册 */}
            {element}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
