#### 构建配置管理的可选方案

- 通过多个配置文件管理不同环境的构建，webpack --config 参数进行控制
- 将构建配置设计成一个库，比如：hjs-webpack、Neutrino、webpack-blocks
- 抽离成一个工具进行管理，比如：create-react-app、kyt、nwb
- 将所有的配置放在一个文件，通过 --env 参数控制分支选择
