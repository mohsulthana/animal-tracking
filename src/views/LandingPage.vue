<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-container>
        <b-navbar-nav>
          <b-nav-item href="#">Home</b-nav-item>
          <b-nav-item href="#about">About</b-nav-item>
        </b-navbar-nav>
      </b-container>
    </b-navbar>

    <div class="py-5 mb-5" style="height: 400px; background-image: url('https://images.unsplash.com/photo-1486754735734-325b5831c3ad?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); display: flex; align-items: center; justify-content: center;">
      <b-jumbotron header="SmartFarm" lead="Precision Agri-business and Big Data Solutions for Modernized Livestock Farming" />
    </div>

    <b-container>
      <b-row class="py-10">
        <b-col cols="12" lg="4">
          <h3>Who we are</h3>
          <p>
            A team of university academics and students, collaborating with international institutions and local farmer, eager to solve rural livestock farming problems using precision agri-business and big data technologies.
          </p>
        </b-col>
        <b-col cols="12" lg="4">
          <h3>What we concern</h3>
          <p>
            How to benefit rural livestock farming sectors from the latest developments of the latest smart and intelligent technologies.
          </p>
        </b-col>
        <b-col cols="12" lg="4">
          <h3>What we do</h3>
          <p>
            Smart livestock monitoring: counting, individual location
          </p>
        </b-col>
      </b-row>
    </b-container>

    <b-container class="my-12 py-40" fluid="md">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle.accordion-1 block variant="link" style="width: 100%;">Smart Sensors and IoT Devices</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              Individual animal, utility, environment, and staff monitoring; history statistic and trend prediction; abnormalities alerting.
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle.accordion-2 block variant="link" style="width: 100%;">Big Data</b-button>
        </b-card-header>
        <b-collapse id="accordion-2" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              Market prediction; decision making support for farmers and government/authority;
              Autonomous farming operations: early illnesses detection, epidemic prevention, breeding optimization, feeding regimens, pasture rotation, marketing
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle.accordion-3 block variant="link" style="width: 100%;">Environment monitoring</b-button>
        </b-card-header>
        <b-collapse id="accordion-3" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              Temperature, humidity, and air quality for livestock living condition management; long term pasture weather condition prediction
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle.accordion-4 block variant="link" style="width: 100%;">Sustainability management</b-button>
        </b-card-header>
        <b-collapse id="accordion-4" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              Satellite and local imaging and analysis for stocking rate optimization; increase long term productivity
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-container>
  </div>
</template>

<script>

</script>

<style scoped>
</style>
