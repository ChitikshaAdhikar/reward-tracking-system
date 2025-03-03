class Logger {
  constructor(currentLevel = "debug") {
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    this.currentLevel = currentLevel;
  }

  canLog(level) {
    return this.levels[level] >= this.levels[this.currentLevel];
  }

  log(message, level = "info") {
    if (this.canLog(level)) {
      console.log(
        `${new Date().toISOString()} [${level.toUpperCase()}] ${message}`
      );
    }
  }

  debug(message) {
    this.log(message, "debug");
  }

  info(message) {
    this.log(message, "info");
  }

  warn(message) {
    this.log(message, "warn");
  }

  error(message) {
    this.log(message, "error");
  }
}

export default Logger;
