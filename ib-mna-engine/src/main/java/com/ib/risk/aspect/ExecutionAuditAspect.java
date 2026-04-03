package com.ib.risk.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class ExecutionAuditAspect {

    @Pointcut("execution(* com.ib.risk.service.AutoHedgingService.generateRecommendations(..)) || " +
              "execution(* com.ib.risk.service.AutoHedgingService.executeStrategy(..))")
    public void criticalFinancialAction() {}

    @AfterReturning(pointcut = "criticalFinancialAction()", returning = "result")
    public void logFinancialAction(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        
        log.info("============== [AUDIT LOG] ==============");
        log.info("TIME: {}", LocalDateTime.now());
        log.info("ACTION: {}", methodName);
        log.info("ARGUMENTS: {}", Arrays.toString(args));
        log.info("RESULT: {}", result);
        log.info("STATUS: SUCCESS - Financial Impact Recorded");
        log.info("==========================================");
    }
}
