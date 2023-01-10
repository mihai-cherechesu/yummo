#!/bin/bash

eksctl create iamserviceaccount \
  --cluster=yummo-eks-KfJKzcQ1 \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::654575815905:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve
