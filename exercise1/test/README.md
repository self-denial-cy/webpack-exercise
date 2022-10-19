#### 冒烟测试（smoke testing）

冒烟测试是指对提交测试的软件在进行详细深入的测试之前而进行的预测试，这种预测试的主要目的是暴露导致软件需重新发布的基本功能失效等严重问题。

#### 单元测试与测试覆盖率

- 单纯的测试框架（mocha、ava），需要断言库
  - chai
  - should.js
  - expect
  - better-assert
- 集成框架，开箱即用
  - Jasmine
  - Jest（推荐学习）
- 极简 API

#### 持续集成

- 优点
  - 快速发现错误
  - 防止分支大幅偏离主干
- 核心措施：代码集成到主干之前，必须通过自动化测试（只要有一个测试用例失败，就不能集成）

#### GitHub 最流行的 CI（Top 10）

- Travis CI（收费且贵）
- Circle CI
- Jenkins
- AppVeyor
- CodeShip
- Drone
- Semaphore CI
- Buildkite
- Wercker
- TeamCity
